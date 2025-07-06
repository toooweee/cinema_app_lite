import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from '@roles/dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators';
import { RequestUser } from '@auth/types';
import Roles from '@roles/types/roles.enum';
import { ROLES } from 'src/roles/decorator';
import { RolesGuard } from '@roles/guard';
import { UpdateRoleDto } from '@roles/dto/update-role.dto';

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
  async findAll() {
    return this.rolesService.findAll();
  }

  @Patch(':id')
  @ROLES(Roles.ADMIN)
  @ApiOperation({ summary: '[ADMIN] редактировать роль' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }
}
