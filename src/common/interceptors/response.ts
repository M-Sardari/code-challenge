import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import {ApiResponseInterface} from "../interface";

@Injectable()
export class Response<T> implements NestInterceptor<T, ApiResponseInterface> {
  constructor() {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseInterface> {
    return next.handle().pipe(
      map((response: any) => {
        const request = context.switchToHttp().getRequest();

        const api = {
          statusCode: HttpStatus.OK,
          response
        };

        context.switchToHttp().getResponse().status(200);
        return api;
      })
    );
  }
}
