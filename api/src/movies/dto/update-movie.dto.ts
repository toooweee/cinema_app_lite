import { CreateMovieSchema } from '@movies/dto/create-movie.dto';
import { createZodDto } from 'nestjs-zod';

export const UpdateMovieSchema = CreateMovieSchema.partial();

export class UpdateMovieDto extends createZodDto(UpdateMovieSchema) {}
