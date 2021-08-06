import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicController } from './music.controller';
import { Music } from './music.entity';
import { MusicService } from './music.service';

@Module({
  imports: [TypeOrmModule.forFeature([Music])],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {}
