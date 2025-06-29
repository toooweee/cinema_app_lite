import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { RolesGuard } from '@roles/guard';
import { ROLES } from '@roles/decorator';
import Roles from '@roles/types/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(RolesGuard)
@ApiBearerAuth()
@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ROLES(Roles.ADMIN, Roles.MANAGER)
  @ApiOperation({ summary: '[ADMIN, MANAGER] получить всех пользователей' })
  async findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ROLES(Roles.ADMIN, Roles.MANAGER)
  @ApiOperation({ summary: '[ADMIN, MANAGER] получить одного пользователя' })
  async findOne() {
    return this.clientsService.findOne();
  }

  @Delete(':id')
  @ROLES(Roles.ADMIN)
  @ApiOperation({ summary: '[ADMIN] удалить пользователя' })
  async delete(id: string) {
    return this.clientsService.delete(id);
  }
}
