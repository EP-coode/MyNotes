import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { Pagination } from 'src/common/dtos/pagination.dto';
import { CreateNoteDto } from './dto/createNote.dto';
import { NotesQueryParameters } from './dto/notesQueryParamaters.dto';
import { NotesService } from './notes.service';

@ApiTags('notes')
@ApiBearerAuth('jwt-auth')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(
    @Body() createNoteDto: CreateNoteDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.notesService.create(createNoteDto, userId);
  }

  @Get()
  @ApiQuery({
    name: 'categories',
    required: false,
    explode: false,
    type: String,
    isArray: true,
  })
  findAll(
    @GetCurrentUserId() userId: number,
    @Query() notesQueryParameters: NotesQueryParameters,
    @Query('categories') categories?: string,
  ) {
    return this.notesService.findAllUserNotes(
      userId,
      notesQueryParameters,
      !!categories ? categories.split(',') : null,
    );
  }

  @Get('/search-hints')
  searchHint(
    @Query('title') title: string,
    @GetCurrentUserId() userId: number,
  ) {
    return this.notesService.getSearchHint(title, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetCurrentUserId() userId: number) {
    return this.notesService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetCurrentUserId() userId: number,
    @Body() updateUserDto: CreateNoteDto,
  ) {
    return this.notesService.update(+id, userId, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUserId() userId: number) {
    return this.notesService.deleteNote(+id, userId);
  }
}
