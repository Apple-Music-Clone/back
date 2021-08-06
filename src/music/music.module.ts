import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { Music } from './music.entity';
import { MusicService } from './music.service';

@Module({
  imports: [Music],
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
