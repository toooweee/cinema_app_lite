import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@roles/guard';
import { ROLES } from '@roles/decorator';
import Roles from '@roles/types/roles.enum';
import { CreateEmployeeDto, UpdateEmployeeDto } from '@employees/dto';
import { CurrentUser } from '@common/decorators';
import { RequestUser } from '@auth/types';

@UseGuards(RolesGuard)
@ApiBearerAuth()
@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ROLES(Roles.ADMIN)
  @ApiOperation({ summary: '[ADMIN] создать сотрудника' })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ROLES(Roles.ADMIN, Roles.MANAGER)
  @ApiOperation({ summary: '[ADMIN, MANAGER] получить всех сотрудников' })
  async findAll(@CurrentUser() currentUser: RequestUser) {
    return this.employeesService.findAll(currentUser);
  }

  @Get(':id')
  @ROLES(Roles.ADMIN)
  @ApiOperation({ summary: '[ADMIN] получить данные сотрудника' })
  async findOne(@CurrentUser() currentUser: RequestUser, id: string) {
    return this.employeesService.findOne(currentUser, id);
  }

  @Patch(':id')
  @Post()
  @ROLES(Roles.ADMIN)
  @ApiOperation({ summary: '[ADMIN] обновить данные сотрудника' })
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }
}
