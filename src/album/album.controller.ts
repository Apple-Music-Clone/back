import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { Album } from './album.entity';
import { AlbumService } from './album.service';

@ApiTags('Albums')
@Controller('albums')
@ApiOAuth2(['public'])
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin', 'default'],
  'Update-One': ['admin', 'default'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin', 'default'],
  'Read-All': ['admin', 'default'],
  'Read-One': ['admin', 'default'],
  'Replace-One': ['admin', 'default'],
})
export class AlbumController {
  constructor(private service: AlbumService) {}

  @Get()
  public getAlbums(): Promise<Album[]> {
    return this.service.getAlbums();
  }

  @Get(':id')
  public getAlbum(@Param('id') id: string): Promise<Album> {
    return this.service.getAlbum(id);
  }

  @Post('')
  public createAlbum(
    @Body(new SanitizePipe(Album)) dto: Album,
  ): Promise<Album> {
    return this.service.createAlbum(dto);
  }

  @Patch(':id')
  public updateAlbum(
    @Param('id') id: string,
    @Body(new SanitizePipe(Album)) dto: Album,
  ): Promise<Album> {
    return this.service.updateAlbum(id, dto);
  }

  @Delete(':id')
  public deleteAlbum(@Param('id') id: string): Promise<void> {
    return this.service.deleteAlbum(id);
  }
}
