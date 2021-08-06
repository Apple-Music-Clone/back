import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {BaseEntity} from "../base.entity";
import {Music} from "../music/music.entity";
import {Artist} from "../artist.entity";

@Entity()
export class Album extends BaseEntity {
    @Column()
    public coverImage: string;

    @Column()
    public title: string;

    // TODO: ADICIONAR ENUM DE GENEROS
    @Column()
    public genre: string;

    @Column()
    public releaseDate: number;

    @Column()
    public explicit: boolean;

    @OneToMany(() => Music, music => music.album)
    public musics: Music[];

    @ManyToOne(() => Artist, artist => artist.albums)
    public artist: Artist;
}
