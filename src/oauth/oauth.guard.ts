import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  Provider,
} from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { Request, Response } from 'express';
import {
  Request as OAuthRequest,
  Response as OAuthResponse,
} from 'oauth2-server';
import { APP_GUARD } from '@nestjs/core';
import { OAUTH_PUBLIC, OAUTH_SCOPE } from 'src/lib/meta';

@Injectable()
export class OAuthGuard implements CanActivate {
  @Inject(OAuthService)
  private oauthService: OAuthService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const controller = context.getClass();
    const method = context.getHandler();
    return (
      this.isPublic(method) ||
      this.isPublic(controller) ||
      (await this.authenticate(context))
    );
  }

  private isPublic(target: any) {
    return Reflect.getMetadata(OAUTH_PUBLIC, target) === true;
  }

  private getScope(target: any): string[] {
    return Reflect.getMetadata(OAUTH_SCOPE, target) ?? [];
  }

  authenticate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest() as Request & { user: any };
    const res = ctx.switchToHttp().getResponse() as Response;

    const controller = ctx.getClass();
    const handler = ctx.getHandler();
    const scope = [
      ...new Set(this.getScope(controller).concat(this.getScope(handler))),
    ];

    return this.oauthService.oauth
      .authenticate(new OAuthRequest(req), new OAuthResponse(res), { scope })
      .then((token) => {
        req.user = token.user;
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  public static register(): Provider {
    return {
      provide: APP_GUARD,
      useClass: this,
    };
  }
}
