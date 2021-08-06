import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Music } from '../music/music.entity';
import { Artist } from '../artist/artist.entity';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum Genre {
  HIP_HOP = 'HIP HOP/RAP',
  FUNK = 'FUNK',
  ELETRONIC = 'ELETRONIC',
}

@Entity()
export class Album extends BaseEntity<Album> {
  @IsString({ always: true })
  @Expose()
  @ApiProperty({
    type: 'string',
    name: 'coverImage',
    description: 'Image url of album',
  })
  @Column()
  public coverImage: string;

  @IsString({ always: true })
  @Expose()
  @ApiProperty({
    type: 'string',
    name: 'title',
    description: 'Name of album',
  })
  @Column()
  public title: string;

  @ApiProperty({
    enum: [Genre.ELETRONIC, Genre.FUNK, Genre.HIP_HOP],
    enumName: 'Genre',
  })
  @Expose()
  @Column()
  public genre: string;

  @IsNumber()
  @Expose()
  @ApiProperty({
    type: 'number',
    name: 'releaseDate',
    description: 'Release date in unix of album',
  })
  @Column()
  public releaseDate: number;

  @IsBoolean({ always: true })
  @Expose()
  @ApiProperty({
    type: 'number',
    name: 'releaseDate',
    description: 'Release date in unix of album',
  })
  @Column()
  public explicit: boolean;

  @OneToMany(() => Music, (music) => music.album)
  public musics: Music[];

  @IsString({ always: true })
  @Expose()
  @ApiProperty({
    type: 'string',
    name: 'artist',
    description: 'Artist id of album',
  })
  @ManyToOne(() => Artist, (artist) => artist.albums)
  public artist: Artist;
}
