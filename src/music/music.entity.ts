import {Column, Entity, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {BaseEntity} from "../base.entity";
import {Album} from "../album/album.entity";
import {Artist} from "../artist.entity";
import {User} from "../users/user.entity";
import {Playlist} from "../playlist/playlist.entity";

@Entity()
export class Music extends BaseEntity {
    @Column()
    public coverImage: string;

    @Column()
    public title: string;

    @Column()
    public media: string;

    @Column()
    public duration: number;

    @Column()
    public explicit: boolean;

    @ManyToOne(() => Album, album => album.musics, {cascade: true})
    public album: Album;

    @ManyToMany(() => Artist, artist => artist.musics)
    public artists: Artist[];

    @ManyToMany(() => User, user => user.likedMusics)
    @JoinTable()
    public usersLiked: User[];

    @ManyToMany(() => Playlist, playlist => playlist.musics)
    public playlists: Playlist[];
}
