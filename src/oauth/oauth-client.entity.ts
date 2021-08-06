import { BaseEntity } from '../base-entity';
import { Entity, Column } from 'typeorm';

@Entity('oauth_client')
export class OAuthClient extends BaseEntity<OAuthClient> {
  @Column({ nullable: false })
  secret: string;

  @Column('simple-array')
  grants: string[];

  @Column('simple-array')
  redirectUris: string[];

  @Column('int', { default: 30 })
  accessTokenLifetime: number;

  @Column('int', { default: 3600 })
  refreshTokenLifetime: number;

  @Column({ default: false })
  activated: boolean;

  @Column({ nullable: false })
  display_name: string;

  @Column({ nullable: false })
  company_name: string;

  @Column({ nullable: false })
  website: string;
}
