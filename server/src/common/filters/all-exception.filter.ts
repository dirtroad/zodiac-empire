import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ErrorCode, getErrorMessage } from '../constants/error-code';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ErrorCode.UNKNOWN_ERROR;
    let message = getErrorMessage(ErrorCode.UNKNOWN_ERROR);
    let data: any = null;

    if (exception instanceof Error) {
      message = exception.message;
    }

    // 记录错误日志
    console.error('[ERROR]', {
      code,
      message,
      status,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(HttpStatus.OK).json({
      code,
      message,
      data,
      timestamp: Date.now(),
    });
  }
}