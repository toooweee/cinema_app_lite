import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { CreateUserDto } from '@users/dto';
import * as argon from 'argon2';
import * as uuid from 'uuid';
import { ConfigService } from '@nestjs/config';
import { RequestUser } from '@auth/types';
import Roles from '@roles/types/roles.enum';
import SortOrder = Prisma.SortOrder;

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

  async findAll() {}

  async findOne(where: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({
      where,
    });
  }

  async me(currentUser: RequestUser) {
    const includeOption: Prisma.UserInclude = {
      avatars: {
        orderBy: [{ createdAt: 'desc' }],
        take: 1,
        select: { path: true },
      },
      reviews: true,
      client: {
        include: {
          role: true,
        },
      },
      employee: {
        include: {
          role: true,
        },
      },
    };

    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: currentUser.sub },
      include: includeOption,
    });

    console.log(user);

    return user;
  }
}
