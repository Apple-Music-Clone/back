import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Album } from '../album/album.entity';
import { Artist } from '../artist/artist.entity';
import { User } from '../user/user.entity';
import { Playlist } from '../playlist/playlist.entity';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

@Entity()
export class Music extends BaseEntity<Music> {
  @IsString({ always: true })
  @Expose()
  @ApiProperty({
    type: 'string',
    name: 'coverImage',
    description: 'Image of music',
  })
  @Column()
  public coverImage: string;

  @IsString({ always: true })
  @Expose()
  @ApiProperty({
    type: 'string',
    name: 'title',
    description: 'Name of music',
  })
  @Column()
  public title: string;

  @IsString({ always: true })
  @Expose()
  @ApiProperty({
    type: 'string',
    name: 'media',
    description: 'Audio file of music',
  })
  @Column()
  public media: string;

  @IsNumber()
  @Expose()
  @ApiProperty({
    type: 'number',
    name: 'duration',
    description: 'Duration in seconds of music',
  })
  @Column()
  public duration: number;

  @IsNumber()
  @Expose()
  @ApiProperty({
    type: 'number',
    name: 'releaseDate',
    description: 'Release date in unix of music',
  })
  @Column()
  public releaseDate: number;

  @IsBoolean({ always: true })
  @Expose()
  @ApiProperty({
    type: 'boolean',
    name: 'explicit',
    description: 'If the music has explicit content',
  })
  @Column()
  public explicit: boolean;

  @Expose()
  @ManyToOne(() => Album, (album) => album.musics, { cascade: true })
  public album: Album;

  @ManyToMany(() => Artist, (artist) => artist.musics)
  public artists: Artist[];

  @ManyToMany(() => User, (user) => user.likedMusics)
  @JoinTable()
  public usersLiked: User[];

  @ManyToMany(() => Playlist, (playlist) => playlist.musics)
  public playlists: Playlist[];
}
