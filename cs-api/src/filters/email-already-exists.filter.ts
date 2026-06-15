import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { EmailAlreadyExistsError } from "@src/errors/email-already-exists.error";

@Catch(EmailAlreadyExistsError)
export class EmailAlreadyExistsFilter implements ExceptionFilter {
    catch(exception: EmailAlreadyExistsError, host: ArgumentsHost) {
        
        const response = host.switchToHttp().getResponse();
        const request = host.switchToHttp().getRequest();


        response.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: request.url
        })
    }

}