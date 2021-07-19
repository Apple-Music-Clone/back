import { Controller } from "../decorators/http/controller.decorator";
import { Delete, Get, Post, Put } from "../decorators/http/method.decorator";
import { Body } from "../decorators/http/params/body.decorator";
import { Query } from "../decorators/http/params/query.decorator";
import User from "./users.interface";
import UsersService from "./users.service";

// Definindo o controller e o path
@Controller("/users")
class UsersController {
  // Pegando o service para usar nas rotas
  constructor(public service: UsersService) {}

  // Definindo a rota com o path "xxx", ficaria: "www.url.com.br/users/xxx"
  // @Get('xxx')
  // Pegando query params "teste", ficaria: "www.url.com.br/users/xxx?teste=$1"
  // $1 = valor que passou
  // public async getUsers(@Query('teste') teste: string) {
  //   // Pega todos os users
  //   const users = await this.service.getAll();

  //   return users;
  // }

  // @Get("")
  // public async getUsers(): Promise<User[]> {
  //   const users = await this.service.getAll();

  //   return users;
  // }

  // @Get("/:id")
  // public async getOneUser(id: string): Promise<User> {
  //   const user = await this.service.getOneUser(id);

  //   return user;
  // }

  @Post("")
  public async createUser(@Body() body: User): Promise<User> {
    const user = await this.service.createUser(body);

    return user;
  }

  // @Patch("/:id")
  // public async updateUser(id: string, body: User): Promise<User> {
  //   const user = await this.service.updateUser(id, body);
  //   return user;
  // }

  // @Delete("/:id")
  // public async deleteUser(id: string): Promise<void> {
  //   return this.service.deleteUser(id);
  // }
}

export default UsersController;
