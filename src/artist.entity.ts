import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import {Album} from "./album/album.entity";
import { BaseEntity } from "./base.entity";
import {Music} from "./music/music.entity";
import {User} from "./users/user.entity";

@Entity()
export class Artist extends BaseEntity {
    @Column()
    public coverImage: string;

    @Column()
    public title: string;

    @OneToMany(() => Album, album => album.artist)
    public albums: Album[];

    @ManyToMany(() => Music, music => music.artists, {
        cascade: true
    })
    @JoinTable()
    public musics: Music[]

    @ManyToOne(() => User, user => user.artists)
    public admin: User;
}
