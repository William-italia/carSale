import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();

        const response = ctx.getResponse();
        const request = ctx.getRequest();        

        const exceptionResponse = exception.getResponse();

        console.error(exception);
        
        response.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            temp: exceptionResponse,
            timestamp: new Date().toISOString(),
            path: request.url
        })

    }
}