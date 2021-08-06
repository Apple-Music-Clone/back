import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { Music } from './music.entity';
import { MusicService } from './music.service';

@ApiTags('Musics')
@Controller('musics')
@ApiOAuth2(['public'])
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin'],
  'Update-One': ['admin'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin'],
  'Read-All': ['admin', 'default'],
  'Read-One': ['admin', 'default'],
  'Replace-One': ['admin'],
})
export class MusicController {
  constructor(private service: MusicService) {}

  @Get()
  public getMusics(): Promise<Music[]> {
    return this.service.getMusics();
  }

  @Get(':id')
  public getMusic(@Param('id') id: string): Promise<Music> {
    return this.service.getMusic(id);
  }

  @Post('')
  public createMusic(
    @Body(new SanitizePipe(Music)) dto: Music,
  ): Promise<Music> {
    return this.service.createMusic(dto);
  }

  @Patch(':id')
  public updateMusic(
    @Param('id') id: string,
    @Body(new SanitizePipe(Music)) dto: Music,
  ): Promise<Music> {
    return this.service.updateMusic(id, dto);
  }

  @Delete(':id')
  public deleteMusic(@Param('id') id: string): Promise<void> {
    return this.service.deleteMusic(id);
  }
}
