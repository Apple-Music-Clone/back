import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Album } from '../album/album.entity';
import { BaseEntity } from '../base-entity';
import { Music } from '../music/music.entity';
import { User } from '../user/user.entity';

@Entity()
export class Artist extends BaseEntity<Artist> {
  @IsString({ always: true })
  @Expose()
  @ApiProperty({
    type: 'string',
    name: 'coverImage',
    description: 'Image url of artist',
  })
  @Column()
  public coverImage: string;

  @IsString({ always: true })
  @Expose()
  @ApiProperty({
    type: 'string',
    name: 'title',
    description: 'Name of artist',
  })
  @Column()
  public title: string;

  @OneToMany(() => Album, (album) => album.artist)
  public albums: Album[];

  @ManyToMany(() => Music, (music) => music.artists, {
    cascade: true,
  })
  @JoinTable()
  public musics: Music[];

  @IsString({ always: true })
  @Expose()
  @ApiProperty({
    type: 'string',
    name: 'admin',
    description: 'User id admin of artist',
  })
  @ManyToOne(() => User, (user) => user.artists)
  public admin: User;
}
