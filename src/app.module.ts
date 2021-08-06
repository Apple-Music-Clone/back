import 'dotenv/config';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthModule } from './oauth/oauth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';
import { PlaylistModule } from './playlist/playlist.module';
import { MusicModule } from './music/music.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
    OAuthModule,
    PlaylistModule,
    MusicModule,
    ArtistModule,
    AlbumModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
