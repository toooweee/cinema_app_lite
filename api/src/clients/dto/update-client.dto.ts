import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateClientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.date(),
  email: z.string(),
  password: z.string(),
});

export class UpdateClientDto extends createZodDto(UpdateClientSchema) {}
