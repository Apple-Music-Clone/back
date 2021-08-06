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
import { Artist } from './artist.entity';
import { ArtistService } from './artist.service';

@ApiTags('Artists')
@Controller('artists')
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
export class ArtistController {
  constructor(private service: ArtistService) {}

  @Get()
  public getArtists(): Promise<Artist[]> {
    return this.service.getArtists();
  }

  @Get(':id')
  public getArtist(@Param('id') id: string): Promise<Artist> {
    return this.service.getArtist(id);
  }

  @Post('')
  public createArtist(
    @Body(new SanitizePipe(Artist)) dto: Artist,
  ): Promise<Artist> {
    return this.service.createArtist(dto);
  }

  @Patch(':id')
  public updateArtist(
    @Param('id') id: string,
    @Body(new SanitizePipe(Artist)) dto: Artist,
  ): Promise<Artist> {
    return this.service.updateArtist(id, dto);
  }

  @Delete(':id')
  public deleteArtist(@Param('id') id: string): Promise<void> {
    return this.service.deleteArtist(id);
  }
}
