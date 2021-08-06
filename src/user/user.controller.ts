import UsersService from './user.service';
import { User } from './user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOAuth2,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  OAuthActionsScope,
  OAuthPublic,
} from 'src/lib/decorators/oauth.decorator';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { UserDto } from './dto/user.dto';
import { Suggestion } from './interfaces/suggestions';

@ApiTags('Users')
@Controller('users')
@ApiOAuth2(['public'])
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin', 'default'],
  'Update-One': ['admin', 'default', 'change_password'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin', 'default'],
  'Read-All': ['admin', 'default'],
  'Read-One': ['admin', 'default'],
  'Replace-One': ['admin', 'default'],
})
class UserController {
  constructor(public service: UsersService) {}

  @Get()
  public async getUsers(): Promise<User[]> {
    return await this.service.getAllUsers();
  }

  @Get('/me')
  public async getMe(@CurrentUser() user: User): Promise<User> {
    return await this.service.getOneUser(user.id);
  }

  @Get('/suggestions')
  public async getSuggestions(): Promise<Suggestion[]> {
    return this.service.getSuggestions();
  }

  @Get('/:id')
  public getOneUser(@Param('id') id: string): Promise<User> {
    return this.service.getOneUser(id);
  }

  @ApiBody({ type: UserDto })
  @OAuthPublic()
  @Post()
  public createUser(@Body(new SanitizePipe(UserDto)) dto: UserDto) {
    return this.service.createUser(dto);
  }

  @Patch('/:id')
  public async updateUser(
    @Param('id') id: string,
    @Body() body: User,
  ): Promise<User> {
    console.log(body);
    return this.service.updateUser(id, body);
  }

  @Delete('/:id')
  public async deleteUser(@Param('id') id: string): Promise<void> {
    return this.service.deleteUser(id);
  }
}

export default UserController;
