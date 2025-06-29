import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@tokens/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokensService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(payload: JwtPayload) {
    const [refreshTokenSecret, refreshTokenExpires] = await Promise.all([
      this.configService.get<string>('JWT_RT_SECRET'),
      this.configService.get<string>('JWT_RT_EXPIRES'),
    ]);

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshTokenSecret,
      expiresIn: refreshTokenExpires,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveTokenToDatabase(token: string, userId: string) {
    return this.prismaService.token.upsert({
      where: {
        userId,
      },
      create: {
        token,
        userId,
      },
      update: {
        token,
      },
    });
  }

  async refreshTokens(token: string) {
    const payload: JwtPayload & { exp: string; iat: string } =
      await this.jwtService.verifyAsync(
        token,
        this.configService.getOrThrow('JWT_RT_SECRET'),
      );

    if (!payload) {
      throw new UnauthorizedException();
    }

    const tokenFromDb = await this.findRefreshToken(token);

    if (!tokenFromDb) {
      throw new UnauthorizedException();
    }

    const newPayload: JwtPayload = { sub: payload.sub, email: payload.email };

    const tokens = await this.generateTokens(newPayload);

    await this.saveTokenToDatabase(tokens.refreshToken, payload.sub);

    return tokens;
  }

  async delete(token: string) {
    return this.prismaService.token.delete({
      where: {
        token,
      },
    });
  }

  async validateRefreshToken(
    token: string,
  ): Promise<JwtPayload & { exp: string; iat: string }> {
    return await this.jwtService.verifyAsync(
      token,
      this.configService.getOrThrow('JWT_RT_SECRET'),
    );
  }

  private async findRefreshToken(token: string) {
    return this.prismaService.token.findUnique({
      where: {
        token,
      },
    });
  }
}
