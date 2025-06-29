import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { Response } from 'express';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientRustPanicError,
)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientUnknownRequestError
      | Prisma.PrismaClientValidationError
      | Prisma.PrismaClientInitializationError
      | Prisma.PrismaClientRustPanicError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaKnownException(exception, res);
    }

    this.logger.error(`Prisma error: ${exception.message}`);

    super.catch(exception, host);
  }

  private handlePrismaKnownException(
    exception: Prisma.PrismaClientKnownRequestError,
    res: Response,
  ) {
    switch (exception.code) {
      case 'P2002': {
        const target = exception.meta?.target;
        let messageFields: string;

        if (Array.isArray(target)) {
          messageFields = target.join('. ');
        } else if (typeof target === 'string') {
          messageFields = target;
        } else {
          messageFields = 'неизвестные поля';
        }

        return res.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: `Конфликт: запись с ${messageFields} уже существует`,
        });
      }
      case 'P2003':
        this.logger.error(exception.message);
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Некорректная связь с другой сущностью',
        });
      case 'P2025':
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Запрашиваемая запись не найдена',
        });
      default:
        this.logger.error(`Unhandled prisma error: ${exception.message}`);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal Server Error',
        });
    }
  }
}
