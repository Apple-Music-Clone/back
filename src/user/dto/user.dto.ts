import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsIn, IsEnum } from 'class-validator';
import { Artist } from 'src/artist/artist.entity';
import { Playlist } from 'src/playlist/playlist.entity';

export class UserDto {
  @IsString({ always: true })
  @Expose()
  @ApiProperty({
    type: 'string',
    name: 'name',
  })
  public name: string;

  @IsString({ always: true })
  @Expose()
  @ApiProperty({
    type: 'string',
    name: 'email',
  })
  public email: string;

  @Expose()
  @ApiProperty({
    type: 'string',
    name: 'avatar',
  })
  public avatar: string;

  @IsString({ always: true })
  @Expose()
  @ApiProperty({
    type: 'string',
    name: 'password',
  })
  public password: string;

  @Expose()
  @ApiProperty({
    type: 'array',
    name: 'devices',
    items: {
      type: 'string',
    },
  })
  public devices: string[];

  // @Column({ type: "varchar" })
  // public country: string;

  @Expose()
  public playlists: Playlist[];

  @Expose()
  public artists: Artist[];

  @Expose()
  public favoritePlaylists: Playlist[];
}
