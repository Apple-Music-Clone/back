import { Exclude } from 'class-transformer';
import { Artist } from 'src/artist/artist.entity';
import { BCryptTransformer } from 'src/lib/bcrypt';
import { Music } from 'src/music/music.entity';
import { Playlist } from 'src/playlist/playlist.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';

export const userBaseRelations: string[] = [
  'playlists',
  'artists',
  'favoritePlaylists',
  'likedMusics',
];

@Entity()
export class User extends BaseEntity<User> {
  @Column()
  public name: string;

  @Column({
    nullable: false,
    unique: true,
  })
  public email: string;

  @Column({ nullable: true })
  public avatar: string;

  @Exclude()
  @Column({
    nullable: false,
    transformer: new BCryptTransformer(),
  })
  public password: string;

  @Column({ type: 'simple-array' })
  public devices: string[];

  // @Column({ type: "varchar" })
  // public country: string;

  @OneToMany(() => Playlist, (playlist) => playlist.user, { cascade: true })
  public playlists: Playlist[];

  @OneToMany(() => Artist, (artist) => artist.admin, { cascade: true })
  public artists: Artist[];

  @ManyToMany(() => Playlist, (playlist) => playlist.usersFavorite, {
    cascade: true,
  })
  public favoritePlaylists: Playlist[];

  @ManyToMany(() => Music, (music) => music.usersLiked, {
    cascade: true,
  })
  public likedMusics: User[];
}
