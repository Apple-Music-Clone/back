import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuthCode } from './oauth-code.entity';
import { AuthorizationCode } from 'oauth2-server';

@Injectable()
export class OAuthCodeService {
  constructor(
    @InjectRepository(OAuthCode)
    private readonly repo: Repository<OAuthCode>,
  ) {}

  async save(code: AuthorizationCode) {
    await this.repo.save({
      authorizationCode: code.authorizationCode,
      redirectUri: code.redirectUri,
      client: { id: code.client.id },
      user: { id: code.user.id },
      expiresAt: code.expiresAt,
      scope: Array.isArray(code.scope) ? code.scope : code.scope.split(','),
    });

    return code;
  }

  async findAndDelete(code: string): Promise<OAuthCode | null> {
    const authCode = await this.repo.findOne(code, {
      relations: ['user', 'client'],
    });
    await this.repo.remove(authCode);
    return authCode.expiresAt.getTime() > Date.now() ? authCode : null;
  }
}
