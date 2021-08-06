import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './user.entity';
import * as BCrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { Suggestion } from './interfaces/suggestions';
import { MusicService } from 'src/music/music.service';
import * as moment from 'moment';
import { AlbumService } from 'src/album/album.service';

@Injectable()
class UserService {
  private baseRelations: string[];

  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private musicService: MusicService,
    private albumService: AlbumService,
  ) {
    this.baseRelations = [];
  }

  public async getAllUsers(): Promise<User[]> {
    return this.repo.find();
  }

  public async getOneUser(id: string, options?: FindOneOptions): Promise<User> {
    if (!options) {
      options = {
        relations: this.baseRelations,
      };
    }

    return this.repo.findOne(id);
  }

  public async createUser(body: UserDto): Promise<any> {
    const user = await this.repo.save(body);

    return this.getOneUser(user.id);
  }

  public async updateUser(id: string, body: User): Promise<any> {
    return this.repo.update(id, body);
  }

  public async deleteUser(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  public async getByUsernameAndPassword(email: string, password: string) {
    const user = await this.repo.findOne({
      where: [{ email }],
    });

    return user && BCrypt.compareSync(password, user.password)
      ? classToPlain(user)
      : null;
  }

  public async getSuggestions(): Promise<Suggestion[]> {
    const musics = await this.musicService.getMusics();

    const suggestions: Suggestion[] = [];

    for (const music of musics) {
      const suggestion: Suggestion = {
        image: music.coverImage,
        media: music.media,
        title: music.title,
        type: 'brick',
      };

      const album = await this.albumService.getAlbum(music.album.id);

      suggestion.category = album.artist.title;

      const today = moment().startOf('day').utc();
      const releaseDate = moment.unix(music.releaseDate).startOf('day').utc();

      if (today.unix() === releaseDate.unix()) {
        suggestion.type = 'hero';
        suggestion.subCategory = 'DAILY';
      }

      suggestions.push(suggestion);
    }

    return suggestions;
  }
}

export default UserService;
