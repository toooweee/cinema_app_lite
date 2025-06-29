import { createZodDto } from 'nestjs-zod';
import { CreateGenreSchema } from './create-genre.dto';

export const UpdateGenreSchema = CreateGenreSchema.partial();

export class UpdateGenreDto extends createZodDto(UpdateGenreSchema) {}
