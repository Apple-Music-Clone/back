import { Controller } from "../decorators/http/controller.decorator";
import { Get } from "../decorators/http/method.decorator";
import { Query } from "../decorators/http/params/query.decorator";
import UsersService from "./users.service";

// Definindo o controller e o path
@Controller('/users')
class UsersController {
  // Pegando o service para usar nas rotas
  constructor(public service: UsersService) {}

  // Definindo a rota com o path "xxx", ficaria: "www.url.com.br/users/xxx"
  @Get('xxx')
  // Pegando query params "teste", ficaria: "www.url.com.br/users/xxx?teste=$1" 
  // $1 = valor que passou
  public async getUsers(@Query('teste') teste: string) {
    // Pega todos os users
    const users = await this.service.getAll();

    return users;
  }
}

export default UsersController;
