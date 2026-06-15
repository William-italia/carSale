import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { UserNotFoundError } from "@src/errors/user-not-found.error";

@Catch(UserNotFoundError)
export class UserNotFoundFilter implements ExceptionFilter {
    catch(exception: UserNotFoundError, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();
        const request = host.switchToHttp().getRequest();

        response.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: request.url
        })
    }
}