import { CreateEmployeeSchema } from '@employees/dto/create-employee.dto';
import { createZodDto } from 'nestjs-zod';

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

export class UpdateEmployeeDto extends createZodDto(UpdateEmployeeSchema) {}
