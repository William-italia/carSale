import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TOKEN_PAYLOAD_KEY } from './security.constants';
import { TokenPayloadDto } from '@src/auth/dtos/token-payload.dto';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const req: Request = ctx.getRequest();

    return req[TOKEN_PAYLOAD_KEY] as TokenPayloadDto;
  },
);
