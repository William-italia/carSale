import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { TOKEN_PAYLOAD_KEY } from "./auth.constants";
import { TokenPayloadDto } from "@src/auth/dtos/token-payload.dto";

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();

        return request[TOKEN_PAYLOAD_KEY] as TokenPayloadDto;
    }
)