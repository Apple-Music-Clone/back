import {
  Controller,
  Post,
  Delete,
  Res,
  Req,
  Get,
  Render,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { OAuthService } from './oauth.service';
import * as OAuth2Server from 'oauth2-server';
import { RevokedService } from './revoked.service';
import { OAuthPublic } from '../lib/decorators/oauth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { OAuthClientService } from './oauth-client.service';
import { parse, format } from 'url';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@ApiTags('OAuth Server')
@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oAuthService: OAuthService,
    private readonly revokedTokenService: RevokedService,
    private readonly clientService: OAuthClientService,
    private readonly jwt: JwtService,
  ) {}

  @OAuthPublic()
  @Post('token')
  async token(@Res() res, @Req() req: Request) {
    const token = await this.oAuthService.oauth.token(
      new OAuth2Server.Request(req),
      new OAuth2Server.Response(res),
    );

    console.log({
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
      client: token.client.id,
      expires: Math.floor(
        (token.accessTokenExpiresAt.getTime() - Date.now()) / 1000,
      ),
    });
    res.json({
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
      client: token.client.id,
      expires: Math.floor(
        (token.accessTokenExpiresAt.getTime() - Date.now()) / 1000,
      ),
    });
  }

  @OAuthPublic()
  @Get('/authorize')
  async authorizeView(
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('scope') scope: string,
    @Query('state') state: string,
    @Res() res,
    @Req() req,
  ) {
    if (!req.session.user)
      return res.redirect(
        `/oauth/login?redirect=${encodeURIComponent(req.originalUrl)}`,
      );

    if (!clientId) throw new BadRequestException('Invalid Client');
    if (!redirectUri) throw new BadRequestException('Invalid Redirect URI');
    if (!scope) throw new BadRequestException('Invalid Scope');

    const client = await this.clientService.findOne(clientId);

    if (!client) throw new BadRequestException('Invalid Client');

    return res.render('authorize', {
      client,
      state,
      redirectUri,
      user: req.session.user,
      tokenScope: scope.split(','),
    });
  }

  @OAuthPublic()
  @Post('/authorize')
  async authorize(@Res() res: Response, @Req() req) {
    return this.oAuthService.oauth
      .authorize(
        new OAuth2Server.Request(req),
        new OAuth2Server.Response(res),
        {
          authenticateHandler: {
            handle: (req) => (req.session && req.session.user) || false,
          },
        },
      )
      .then((token) => {
        const url = parse(token.redirectUri);
        url.query = Object.assign({}, url.query, {
          code: token.authorizationCode,
          state: req.query.state,
        });

        res.redirect(format(url));
      });
  }

  @OAuthPublic()
  @Post('session')
  async session(
    @Req()
    req,
    @Res()
    res: Response,
    @Query('redirect')
    redirect: string,
  ) {
    const oauthReq = new OAuth2Server.Request(req);
    oauthReq.body.grant_type = 'password';
    oauthReq.headers.authorization =
      'Basic ZWVkYjRiMDEtYzc0My00Yjk5LTg4ZjAtMDQ2ZWU0NjIyMDNmOkU2NUE4NkZGNTlEQzUxMkQzMzJENkQ5M0JGOEFC';
    return this.oAuthService.oauth
      .token(oauthReq, new OAuth2Server.Response(res))
      .then((token) => {
        req.session.user = token.user;
        res.redirect(redirect);
      });
  }

  @OAuthPublic()
  @Get('/login')
  @Render('login')
  loginView(@Query('redirect') redirect) {
    return {
      redirect: redirect,
    };
  }

  @Delete('token/revoke')
  revoke() {
    // return this.oAuthService.revokeToken(this.jwt)
  }

  // @OAuthPublic()
  // @Post('requestRecoverPassword/:email')
  // public requestRecoverPassword(@Param('email') email: string) {
  //   // return this.oAuthService.requestRecoverPassword(email);
  // }
}
