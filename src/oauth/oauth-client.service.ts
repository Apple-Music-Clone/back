import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OAuthClient } from './oauth-client.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OAuthClientService {
  constructor(
    @InjectRepository(OAuthClient)
    private readonly repo: Repository<OAuthClient>,
  ) {}

  async getClientByIdAndSecret(
    client_id: string,
    secret: string,
  ): Promise<OAuthClient | null> {
    return this.repo.findOne({
      where: {
        id: client_id,
        secret: secret,
      },
    });
  }

  async findOne(clientId: string): Promise<OAuthClient | null> {
    return this.repo.findOne(clientId);
  }
}
