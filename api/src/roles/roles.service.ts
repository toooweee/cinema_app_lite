import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { CreateRoleDto } from '@roles/dto';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    return this.prismaService.role.create({
      data: {
        ...createRoleDto,
      },
    });
  }

  async findAll() {
    return this.prismaService.role.findMany();
  }

  async findOne(where: Prisma.RoleWhereUniqueInput) {
    return this.prismaService.role.findUniqueOrThrow({
      where,
    });
  }
}
