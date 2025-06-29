import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
