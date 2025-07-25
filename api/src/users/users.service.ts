import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { CreateUserDto } from '@users/dto';
import * as argon from 'argon2';
import * as uuid from 'uuid';
import { ConfigService } from '@nestjs/config';
import { RequestUser } from '@auth/types';
import * as fs from 'fs/promises';
import * as path from 'node:path';
import * as process from 'node:process';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const hashedPassword = await argon.hash(password);
    const activationLink =
      this.configService.get<string>('API_URL') + `/${uuid.v4()}`;

    return this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        activationLink,
      },
    });
  }

  async loadAvatar(currentUser: RequestUser, file: Express.Multer.File) {
    const savedPath: string = '';

    try {
      return await this.prismaService.user.update({
        where: {
          id: currentUser.sub,
        },
        data: {
          avatars: {
            create: {
              path: file.filename,
            },
          },
        },
      });
    } catch {
      try {
        await fs.unlink(path.join(process.cwd(), 'uploads', savedPath));
      } catch {
        console.log('Ошибка удаления аватарок');
      }
    }
  }

  async findAll() {}

  async findOne(where: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({
      where,
    });
  }

  async me(currentUser: RequestUser) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: currentUser.sub },
      include: {
        employee: {
          include: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
        client: {
          include: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
        avatars: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
      createdAt: user.createdAt,
      employee: user.employee
        ? {
            id: user.employee.id,
            name: user.employee.name,
            employmentDate: user.employee.employmentDate,
            role: user.employee.role.name,
          }
        : undefined,
      client: user.client
        ? {
            id: user.client.id,
            name: user.client.name,
            dateOfBirth: user.client.dateOfBirth,
            role: user.client.role.name,
          }
        : undefined,
      avatars: user.avatars,
    };
  }
}
