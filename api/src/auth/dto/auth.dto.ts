import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthDto extends createZodDto(AuthSchema) {}
