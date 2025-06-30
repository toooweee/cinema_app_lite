import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema } from '@users/dto';

export const CreateEmployeeSchema = z.object({
  name: z.string(),
  employmentDate: z.coerce.date(),
  roleId: z.string(),
  user: CreateUserSchema,
});

export class CreateEmployeeDto extends createZodDto(CreateEmployeeSchema) {}
