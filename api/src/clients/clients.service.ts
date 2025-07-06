import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll() {
    return this.prismaService.client.findMany({
      include: {
        user: {
          select: {
            email: true,
            avatars: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
            createdAt: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prismaService.client.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            email: true,
            avatars: true,
          },
          include: {
            reviews: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    // Находим клиента с зависимостями
    const client = await this.prismaService.client.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            avatars: true,
            token: true,
            reviews: true,
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    if (client.user) {
      await this.prismaService.avatar.deleteMany({
        where: { userId: client.user.id },
      });

      await this.prismaService.token.deleteMany({
        where: { userId: client.user.id },
      });

      await this.prismaService.review.deleteMany({
        where: { userId: client.user.id },
      });

      await this.prismaService.user.delete({
        where: { id: client.user.id },
      });
    }

    return this.prismaService.client.delete({
      where: { id },
    });
  }
}
