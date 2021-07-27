import { Controller } from "../decorators/http/controller.decorator";
import { Delete, Get, Patch, Post } from "../decorators/http/method.decorator";
import { Body } from "../decorators/http/params/body.decorator";
import UsersService from "./users.service";
import { Param } from "../decorators/http/params/param.decorator";
import { User } from "./user.entity";

@Controller("/users")
class UsersController {
  constructor(public service: UsersService) {}

  @Get()
  public async getUsers(): Promise<User[]> {
    return await this.service.getAllUsers();
  }

  @Get("/:id")
  public getOneUser(@Param("id") id: string): Promise<User> {
    return this.service.getOneUser(id);
  }

  @Post()
  public async createUser(@Body() body: User): Promise<any> {
    return await this.service.createUser(body);
  }
  
  @Patch("/:id")
  public async updateUser(
    @Param("id") id: string,
    @Body() body: User
    ): Promise<User> {
    console.log(body);
    return this.service.updateUser(id, body);
  }

  @Delete("/:id")
  public async deleteUser(@Param("id") id: string): Promise<void> {
    return this.service.deleteUser(id);
  }
}

export default UsersController;
