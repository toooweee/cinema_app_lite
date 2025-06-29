import { CreateReviewSchema } from './create-review.dto';
import { createZodDto } from 'nestjs-zod';

export const UpdateReviewSchema = CreateReviewSchema.partial();

export class UpdateReviewDto extends createZodDto(UpdateReviewSchema) {}
