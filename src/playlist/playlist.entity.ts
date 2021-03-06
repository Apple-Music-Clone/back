import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../base-entity';
import { Music } from '../music/music.entity';

@Entity()
export class Playlist extends BaseEntity<Playlist> {
  @Column()
  public coverImage: string;

  @Column()
  public title: string;

  @ManyToOne(() => User, (user) => user.playlists)
  public user: User;

  @ManyToMany(() => User, (user) => user.favoritePlaylists)
  public usersFavorite: User[];

  @ManyToMany(() => Music, (music) => music.playlists)
  @JoinTable()
  public musics: Music[];
}
