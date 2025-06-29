import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { CreateUserDto } from '@users/dto';
import * as argon from 'argon2';
import * as uuid from 'uuid';
import { ConfigService } from '@nestjs/config';
import { RolesService } from '@roles/roles.service';

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
}
