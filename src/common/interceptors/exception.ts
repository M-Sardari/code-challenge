import {
  ArgumentsHost, Catch,
  ExceptionFilter, HttpStatus,
} from "@nestjs/common";
import {ApiExceptionInterface} from "../interface/exception";

@Catch()
export class Exception implements ExceptionFilter {
  constructor() {
  }

  catch(exception: any, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const res = http.getResponse();
    const statusCode: number = exception
      ? exception.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const error: string | string[] = exception
      ? exception.message
      : 'Unknown Error';
    const messages: string[] = typeof error === 'string' ? [error] : error;


    const api :ApiExceptionInterface={
      statusCode,
      messages,
    }

    res.status(statusCode).json(api);
  }

}
