import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const controller = context.getClass().name;
    const handler = context.getHandler().name;
    const logger = new Logger(controller);

    logger.debug(`[${handler}] ${request.path} START`);
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          logger.debug(
            `[${handler}] ${request.path} END ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
