import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@users/users.module';
import * as Joi from 'joi';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { PrismaExceptionFilter } from '@common/exception-filters';
import { PrismaModule } from '@prisma/prisma.module';
import { AuthModule } from '@auth/auth.module';
import { TokensModule } from '@tokens/tokens.module';
import { RolesModule } from '@roles/roles.module';
import { EmployeesModule } from '@employees/employees.module';
import { ClientsModule } from '@clients/clients.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { MoviesModule } from '@movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './common/config';
import { ReviewsModule } from './reviews/reviews.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
      envFilePath: process.env.NODE_ENV ? '.env.prod' : '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    MulterModule.register(multerConfig),
    UsersModule,
    PrismaModule,
    AuthModule,
    TokensModule,
    RolesModule,
    EmployeesModule,
    ClientsModule,
    MoviesModule,
    GenresModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
  ],
})
export class AppModule {}
