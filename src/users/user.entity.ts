import {Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Playlist} from "../playlist/playlist.entity";
import {BaseEntity} from "../base.entity";
import {Music} from "../music/music.entity";
import {Artist} from "../artist.entity";

@Entity()
export class User extends BaseEntity {
  @Column()
  public name: string;

  @Column({nullable: true})
  public avatar: string;

  @Column({ type: 'simple-array' })
  public devices: string[];

  // @Column({ type: "varchar" })
  // public country: string;

  @OneToMany(() => Playlist, playlist => playlist.user, {cascade: true})
  public playlists: Playlist[]

  @OneToMany(() => Artist, artist => artist.admin, {cascade: true})
  public artists: Artist[]

  @ManyToMany(() => Playlist, playlist => playlist.usersFavorite, {cascade: true})
  public favoritePlaylists: any[];

  @ManyToMany(() => Music, music => music.usersLiked, {
    cascade: true
  })
  public likedMusics: User[];
}
