import { Injectable } from '@nestjs/common';
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
    return this.prismaService.client.delete({
      where: {
        id,
      },
    });
  }
}
