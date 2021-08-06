import { Module } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { JwtModule } from '@nestjs/jwt';
import { OAuthClient } from './oauth-client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevokedToken } from './revoked-token.entity';
import { OAuthClientService } from './oauth-client.service';
import { RevokedService } from './revoked.service';
import { OAuthController } from './oauth.controller';
import { OAuthGuard } from './oauth.guard';
import { OAuthCode } from './oauth-code.entity';
import { OAuthCodeService } from './oauth-code.service';
// import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        issuer: 'http://oauth.pharmago.com.br',
      },
    }),
    UserModule,
    TypeOrmModule.forFeature([OAuthClient, RevokedToken, OAuthCode]),
    // MailerModule,
  ],
  controllers: [OAuthController],
  providers: [
    OAuthService,
    OAuthCodeService,
    OAuthGuard.register(),
    OAuthClientService,
    RevokedService,
  ],
})
export class OAuthModule {}
