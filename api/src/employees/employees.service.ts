import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '@employees/dto';
import { RequestUser } from '@auth/types';
import Roles from '@roles/types/roles.enum';
import { UsersService } from '@users/users.service';
import { RolesService } from '@roles/roles.service';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const existingEmail = await this.usersService.findOne({
      email: createEmployeeDto.user.email,
    });

    if (existingEmail) {
      throw new ConflictException(
        `User with email ${createEmployeeDto.user.email} already exists`,
      );
    }

    const user = await this.usersService.create({
      ...createEmployeeDto.user,
    });

    console.log(user);

    const role = await this.rolesService.findOne({
      id: createEmployeeDto.roleId,
    });

    return this.prismaService.employee.create({
      data: {
        name: createEmployeeDto.name,
        employmentDate: createEmployeeDto.employmentDate,
        user: {
          connect: {
            id: user.id,
          },
        },
        role: {
          connect: {
            id: role.id,
          },
        },
      },
    });
  }

  async findAll(currentUser: RequestUser) {
    if (currentUser.role === Roles.ADMIN) {
      return this.prismaService.employee.findMany({
        include: {
          user: {
            include: {
              avatars: {
                orderBy: {
                  createdAt: 'desc',
                },
                take: 1,
                select: {
                  path: true,
                },
              },
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

    return this.prismaService.employee.findMany({
      include: {
        user: {
          select: {
            avatars: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
              select: {
                path: true,
              },
            },
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

  async findOne(currentUser: RequestUser, id: string) {
    if (currentUser.role === Roles.ADMIN) {
      return this.prismaService.employee.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            include: {
              avatars: {
                orderBy: {
                  createdAt: 'desc',
                },
                take: 1,
                select: {
                  path: true,
                },
              },
            },
          },
        },
      });
    }

    return this.prismaService.employee.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            avatars: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
              select: {
                path: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const { user, roleId, ...employeeData } = updateEmployeeDto;

    return this.prismaService.employee.update({
      where: { id },
      data: {
        ...employeeData,
        ...(user && {
          user: {
            update: {
              email: user.email,
              password: user.password,
            },
          },
        }),
        ...(roleId && {
          role: {
            connect: { id: roleId },
          },
        }),
      },
      include: {
        user: true,
        role: true,
      },
    });
  }
}
