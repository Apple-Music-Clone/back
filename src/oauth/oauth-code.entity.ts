import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OAuthClient } from './oauth-client.entity';

@Entity('oauth_code')
export class OAuthCode {
  @PrimaryColumn('uuid')
  authorizationCode: string;

  @Column()
  redirectUri: string;

  @ManyToOne(() => OAuthClient)
  @JoinColumn()
  client: OAuthClient;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column('simple-array')
  scope: string[];

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  created_at: Date;
}
