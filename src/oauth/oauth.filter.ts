import { ExceptionFilter, Catch, HttpException } from '@nestjs/common';
import * as OAuth2Server from 'oauth2-server';
import { Response } from 'express';

@Catch(OAuth2Server.OAuthError)
export class OAuth2ServerExceptionFilter implements ExceptionFilter {
  catch(
    exception: OAuth2Server.OAuthError,
    host: import('@nestjs/common').ArgumentsHost,
  ) {
    const res: Response = host.switchToHttp().getResponse();

    return res.status(exception.code).json(
      new HttpException(
        {
          name: 'OAuthException',
          error: exception.message,
          code: exception.name,
        },
        exception.code,
      ).getResponse(),
    );
  }
}
