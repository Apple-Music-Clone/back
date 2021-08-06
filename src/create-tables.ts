import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./users/user.entity";
import {Artist} from "./artist.entity";
import {Music} from "./music/music.entity";
import {Album} from "./album/album.entity";

createConnection().then(async connection => {
    const album = new Album();
    album.coverImage = 'https://dummyimage.com/3000x3000/00ff00/fff';
    album.title = 'E o Lucas - Single';
    album.explicit = true;
    album.releaseDate = 123;
    album.genre = 'Hip-Hop'

    const music = new Music()
    music.title = 'E o Lucas';
    music.coverImage = 'https://dummyimage.com/3000x3000/00ff00/fff'
    music.duration = 163
    music.explicit = true
    music.media = 'https://www.looperman.com/media/loops/671112/looperman-l-0671112-0260568-pad-loop.mp3'
    music.album = album;

    const artist = new Artist()
    artist.title = 'Vinicius Monstro';
    artist.coverImage = 'https://dummyimage.com/3000x3000/000/fff';
    artist.musics = [music]

    const user = new User();
    user.name = 'Lucas B S'
    user.devices = ['Apple'];
    user.artists = [artist];

    const albumRepository = connection.getRepository(Album);
    const userRepository = connection.getRepository(User);

    // await albumRepository.save(album);
    await userRepository.save(user);
    console.log("User has been saved");

}).catch(error => console.log(error));
