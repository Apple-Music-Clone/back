import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from 'src/album/album.module';
import { MusicModule } from 'src/music/music.module';
import UserController from './user.controller';
import { User } from './user.entity';
import UserService from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MusicModule, AlbumModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
