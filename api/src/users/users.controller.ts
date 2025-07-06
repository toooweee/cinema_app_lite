import {
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators';
import { RequestUser } from '@auth/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/config';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/avatar')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  @ApiOperation({ summary: '[Все аутентифицированные] загрузить аватар' })
  async loadAvatar(
    @CurrentUser() currentUser: RequestUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.loadAvatar(currentUser, file);
  }

  @Get('me')
  @ApiOperation({ summary: '[Все аутентифицированные] профиль' })
  async me(@CurrentUser() currentUser: RequestUser) {
    return this.usersService.me(currentUser);
  }
}
