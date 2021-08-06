import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './user.entity';
import * as BCrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { UserDto } from './dto/user.dto';

@Injectable()
class UserService {
  private baseRelations: string[];

  constructor(@InjectRepository(User) private repo: Repository<User>) {
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
}

export default UserService;
