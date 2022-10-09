import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { IResponseWrapper } from 'src/common/interfaces/response-wrapper.interface';

export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponseWrapper<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ):
    | Observable<IResponseWrapper<T>>
    | Promise<Observable<IResponseWrapper<T>>> {
    return next.handle().pipe(
      map((data) => {
        return { success: true, data: data };
      }),
    );
  }
}
