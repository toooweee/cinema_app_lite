import { CreateUserSchema } from '@users/dto/create-user.dto';
import { createZodDto } from 'nestjs-zod';

const UpdateUserSchema = CreateUserSchema.partial();

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
