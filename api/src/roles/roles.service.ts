import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { CreateRoleDto } from '@roles/dto';
import { UpdateRoleDto } from '@roles/dto/update-role.dto';

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

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.prismaService.role.update({
      where: {
        id,
      },
      data: {
        ...updateRoleDto,
      },
    });
  }
}
