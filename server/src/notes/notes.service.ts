import { Injectable, NotImplementedException } from '@nestjs/common';
import createNoteDto from './dto/createNote.dto';

@Injectable()
export class NotesService {
  async create(createNoteDto: createNoteDto): Promise<void> {
    throw new NotImplementedException();
  }

  async findAllUserNotes(userId: number): Promise<void> {
    throw new NotImplementedException();
  }
}
