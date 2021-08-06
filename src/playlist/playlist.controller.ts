import { Controller } from '@nestjs/common';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';

@ApiTags('Playlists')
@Controller('playlists')
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
export class PlaylistController {}
