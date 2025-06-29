import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateRoleSchema = z.object({
  name: z.string(),
});

export class CreateRoleDto extends createZodDto(CreateRoleSchema) {}
