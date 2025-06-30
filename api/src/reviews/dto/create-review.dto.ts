import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateReviewSchema = z.object({
  title: z.string(),
  description: z.string(),
  movieId: z.string(),
  score: z.number().positive().min(1).max(10),
});

export class CreateReviewDto extends createZodDto(CreateReviewSchema) {}
