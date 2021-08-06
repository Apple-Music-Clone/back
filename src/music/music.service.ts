import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Music } from './music.entity';

@Injectable()
export class MusicService {
  private baseRelations: string[];

  constructor(@InjectRepository(Music) private repository: Repository<Music>) {
    this.baseRelations = ['album', 'artists', 'usersLiked', 'playlists'];
  }

  public getMusics(): Promise<Music[]> {
    return this.repository.find({ relations: this.baseRelations });
  }

  public getMusic(id: string): Promise<Music> {
    return this.repository.findOne(id, { relations: this.baseRelations });
  }

  public createMusic(dto: Music): Promise<Music> {
    return this.repository.save(dto);
  }

  public async updateMusic(id: string, dto: Music): Promise<Music> {
    await this.repository.update(id, dto);

    return this.getMusic(id);
  }

  public async deleteMusic(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
