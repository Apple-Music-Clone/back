import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private repository: Repository<Artist>,
  ) {}

  public getArtists(): Promise<Artist[]> {
    return this.repository.find();
  }

  public getArtist(id: string): Promise<Artist> {
    return this.repository.findOne(id);
  }

  public createArtist(dto: Artist): Promise<Artist> {
    return this.repository.save(dto);
  }

  public async updateArtist(id: string, dto: Artist): Promise<Artist> {
    await this.repository.update(id, dto);

    return this.getArtist(id);
  }

  public async deleteArtist(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
