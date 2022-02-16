import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { CreateNoteDto } from './dto/createNote.dto';
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
  findAll(@GetCurrentUserId() userId: number) {
    return this.notesService.findAllUserNotes(userId);
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
