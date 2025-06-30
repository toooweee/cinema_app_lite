import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from '@roles/dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators';
import { RequestUser } from '@auth/types';
import Roles from '@roles/types/roles.enum';
import { ROLES } from 'src/roles/decorator';
import { RolesGuard } from '@roles/guard';

@UseGuards(RolesGuard)
@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ROLES(Roles.ADMIN)
  @ApiOperation({ summary: '[ADMIN] добавить роль' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ROLES(Roles.ADMIN, Roles.MANAGER)
  @ApiOperation({ summary: '[ADMIN] получить все роли' })
  async findAll(@CurrentUser() currentUser: RequestUser) {
    return this.rolesService.findAll();
  }
}
