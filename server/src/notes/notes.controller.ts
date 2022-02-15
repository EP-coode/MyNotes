import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import createNoteDto from './dto/createNote.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: createNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  findAll(@GetCurrentUserId() userId: number) {
    return this.notesService.findAllUserNotes(userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.notesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.notesService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notesService.remove(+id);
  // }
}
