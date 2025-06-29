import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext): string | undefined => {
    const request: Request = ctx.switchToHttp().getRequest();
    const cookie: unknown = request.cookies?.[data];
    return typeof cookie === 'string' ? cookie : undefined;
  },
);
