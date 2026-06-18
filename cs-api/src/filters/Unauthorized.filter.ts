import { ArgumentsHost, Catch, ExceptionFilter, HttpCode, HttpStatus } from "@nestjs/common";
import { UnauthorizedError } from "@src/errors/Unauthorized.error";

@Catch()
export class UnauthorizedFilter implements ExceptionFilter {
    catch(exception: UnauthorizedError, host: ArgumentsHost) {

        const ctx = host.switchToHttp();

        const res = ctx.getResponse();
        const req = ctx.getRequest();

        console.error(exception);
        
        res.status(HttpStatus.UNAUTHORIZED).json({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: req.url
        })
        
    }
}