import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateMovieSchema = z.object({
  name: z.string(),
  description: z.string(),
  link: z.string(),
  genres: z.string().array().nonempty(),
  isAvailable: z.boolean().optional(),
});

export class CreateMovieDto extends createZodDto(CreateMovieSchema) {}
