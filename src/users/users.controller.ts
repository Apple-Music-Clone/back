import {Controller} from "../decorators/http/controller.decorator";
import {Get, Post} from "../decorators/http/method.decorator";
import {Body} from "../decorators/http/params/body.decorator";
import User from "./users.interface";
import UsersService from "./users.service";
import {Param} from "../decorators/http/params/param.decorator";

// Definindo o controller e o path
@Controller("/users")
class UsersController {
    // Pegando o service para usar nas rotas
    constructor(public service: UsersService) {
    }

    // Definindo a rota com o path "xxx", ficaria: "www.url.com.br/users/xxx"
    // @Get('xxx')
    // Pegando query params "teste", ficaria: "www.url.com.br/users/xxx?teste=$1"
    // $1 = valor que passou
    // public async getUsers(@Query('teste') teste: string) {
    //   // Pega todos os users
    //   const users = await this.service.getAll();

    //   return users;
    // }

    @Get("")
    public async getUsers(): Promise<User[]> {
        return await this.service.getAll();
    }

    @Get("/:id")
    public getOneUser(@Param('id') id: string): Promise<User> {
        return this.service.getOneUser(id);
    }

    @Post("")
    public async createUser(@Body() body: User): Promise<User> {
        return await this.service.createUser(body);
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
