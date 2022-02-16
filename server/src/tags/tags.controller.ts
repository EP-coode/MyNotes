import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { TagsService } from './tags.service';

@Controller('tags')
@ApiBearerAuth('jwt-auth')
@ApiTags('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll(@GetCurrentUserId() userId) {
    return this.tagsService.countTags(userId);
  }
}
