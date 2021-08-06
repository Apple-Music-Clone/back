import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RevokedToken } from './revoked-token.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RevokedService {
  constructor(
    @InjectRepository(RevokedToken)
    private readonly repo: Repository<RevokedToken>,
  ) {}

  async revokedTokens(jti: string, expires: Date) {
    if (await this.repo.findOne(jti)) {
      return null;
    }

    return this.repo
      .save({
        jti,
        expires,
      })
      .then(() => true)
      .catch(() => false);
  }
}
