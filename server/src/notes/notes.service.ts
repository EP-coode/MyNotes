import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/createNote.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly notesRepository: Repository<Note>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createNoteDto: CreateNoteDto, creatorId: number): Promise<any> {
    const note_tags = createNoteDto.tags.map((tag) => ({
      name: tag,
    }));

    const note = await this.notesRepository.create({
      content: createNoteDto.content,
      creator: { id: creatorId },
      title: createNoteDto.title,
      featured: createNoteDto.featured,
      tags: note_tags,
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

  async findOne(noteId: number, creatorId: number): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: {
        creator: { id: creatorId },
        id: noteId,
      },
    });

    return note;
  }

  async update(noteId: number, creaotrId: number, note: CreateNoteDto) {
    const result = this.notesRepository.update(
      {
        id: noteId,
        creator: { id: creaotrId },
      },
      {
        title: note.title,
        content: note.content,
        featured: note.featured,
      },
    );
  }

  async deleteNote(noteId: number, creatorId: number): Promise<any> {
    const result = await this.notesRepository.delete({
      id: noteId,
      creator: { id: creatorId },
    });
  }
}
