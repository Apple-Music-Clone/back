import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity';

@Injectable()
export class AlbumService {
  private baseRelations: string[];

  constructor(@InjectRepository(Album) private repository: Repository<Album>) {
    this.baseRelations = ['musics', 'artist'];
  }

  public getAlbums(): Promise<Album[]> {
    return this.repository.find({ relations: this.baseRelations });
  }

  public getAlbum(id: string): Promise<Album> {
    return this.repository.findOne(id, { relations: this.baseRelations });
  }

  public createAlbum(dto: Album): Promise<Album> {
    return this.repository.save(dto);
  }

  public async updateAlbum(id: string, dto: Album): Promise<Album> {
    await this.repository.update(id, dto);

    return this.getAlbum(id);
  }

  public async deleteAlbum(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
