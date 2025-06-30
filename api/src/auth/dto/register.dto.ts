import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
