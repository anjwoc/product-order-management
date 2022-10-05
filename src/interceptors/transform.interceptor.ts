import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  result: T;
}

export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    return next.handle().pipe(map((result) => ({ result })));
  }
}
