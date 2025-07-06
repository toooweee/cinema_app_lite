import { CreateRoleSchema } from '@roles/dto/create-role.dto';
import { createZodDto } from 'nestjs-zod';

export const UpdateRoleSchema = CreateRoleSchema.partial();

export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) {}
