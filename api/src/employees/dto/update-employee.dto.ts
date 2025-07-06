import { CreateEmployeeSchema } from '@employees/dto/create-employee.dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial().extend({
  dismissalDate: z.coerce.date().optional(),
});

export class UpdateEmployeeDto extends createZodDto(UpdateEmployeeSchema) {}
