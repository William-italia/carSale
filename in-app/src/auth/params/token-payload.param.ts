import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TOKEN_PAYLOAD_KEY } from '../auth-constants';
import { TokenPayloadDto } from '../dtos/token-payload.dto';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return request[TOKEN_PAYLOAD_KEY] as TokenPayloadDto;
  },
);
