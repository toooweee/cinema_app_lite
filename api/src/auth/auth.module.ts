import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@users/users.module';
import { RolesModule } from '@roles/roles.module';
import { TokensModule } from '@tokens/tokens.module';
import { JwtStrategy } from '@auth/strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/guard';

@Module({
  imports: [UsersModule, RolesModule, TokensModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AuthModule {}
