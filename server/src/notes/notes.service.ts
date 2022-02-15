import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import createNoteDto from './dto/createNote.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly notesRepository: Repository<Note>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createNoteDto: createNoteDto, creatorId: number): Promise<any> {
    const note = await this.notesRepository.create({
      content: createNoteDto.content,
      creator: { id: creatorId },
      title: createNoteDto.title,
    });

    await this.notesRepository.save(note);

    return note;
  }

  async findAllUserNotes(userId: number): Promise<Note[]> {
    const { notes } = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['notes'],
    });

    return notes;
  }

  async deleteNote(noteId: number, creatorId: number): Promise<any> {
    const result = await this.notesRepository.delete({
      id: noteId,
      creator: { id: creatorId },
    });
  }
}
