import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateGenreSchema = z.object({
  name: z.string(),
});

export class CreateGenreDto extends createZodDto(CreateGenreSchema) {}
