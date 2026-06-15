import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { request } from "http";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {

        const response = host.switchToHttp().getResponse();
        const request = host.switchToHttp().getRequest();        

        console.error(exception);
        
        response.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            timestamp: new Date().toISOString(),
            path: request.url
        })

    }
}