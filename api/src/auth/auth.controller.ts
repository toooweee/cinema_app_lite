import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '@auth/dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { refreshTokenKey } from '@tokens/types/refresh-token-key';
import { Public } from '@auth/decorators';
import { Cookies, CurrentUser } from '@common/decorators';
import { RequestUser } from '@auth/types';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary:
      '[ВСЕ, кроме возможных сотрудников] Регистрация. при успехе refreshToken в cookie, accessToken в ответе',
  })
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() registerDto: AuthDto,
  ) {
    const tokens = await this.authService.register(registerDto);
    this.setTokenToCookies(tokens.refreshToken, res);
    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      '[ВСЕ, кроме не зарегистрированных] Логин. при успехе refreshToken в cookie, accessToken в ответе',
  })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: AuthDto,
  ) {
    const tokens = await this.authService.login(loginDto);
    this.setTokenToCookies(tokens.refreshToken, res);
    return {
      accessToken: tokens.accessToken,
    };
  }

  @Get('refresh')
  @ApiOperation({
    summary:
      '[ТОЛЬКО ЗАЛОГИНЕННЫЕ] Обновление токенов. при успехе refreshToken в cookie, accessToken в ответе',
  })
  async refresh(
    @Cookies(refreshTokenKey) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() currentUser: RequestUser,
  ) {
    const tokens = await this.authService.refreshTokens(refreshToken);
    this.setTokenToCookies(tokens.refreshToken, res);
    return {
      accessToken: tokens.accessToken,
    };
  }

  @Get('logout')
  @ApiOperation({
    summary: '[ТОЛЬКО ЗАЛОГИНЕННЫЕ] Выход из системы',
  })
  async logout(
    @Cookies(refreshTokenKey) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie(refreshTokenKey, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: Date.now(),
    });
    await this.authService.logout(refreshToken);
    return HttpStatus.OK;
  }

  private setTokenToCookies(token: string, res: Response) {
    res.cookie(refreshTokenKey, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
  }
}
