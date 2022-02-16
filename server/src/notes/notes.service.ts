import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { find } from 'rxjs';
import { Pagination } from 'src/common/dtos/pagination.dto';
import { User } from 'src/user/entities/user.entity';
import { Any, Connection, FindConditions, In, Like, Repository } from 'typeorm';
import { CreateNoteDto } from './dto/createNote.dto';
import { NotesQueryParameters } from './dto/notesQueryParamaters.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly notesRepository: Repository<Note>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly conn: Connection,
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

  async findAllUserNotes(
    userId: number,
    { orderByDateAsc, phrase, limit, page }: NotesQueryParameters,
    categories: string[],
  ): Promise<Note[]> {
    const query = this.notesRepository
      .createQueryBuilder('note')
      .innerJoin(
        'note_tags_tag',
        'nt',
        `note.id = nt.noteId AND note.creator = :userId
        ${phrase ? 'AND note.title LIKE :phrase' : ''} 
        ${categories ? 'AND nt.tagName IN (:...categories)' : ''}`,
        {
          phrase: `%${phrase}%`,
          userId,
          categories,
        },
      )
      .innerJoin('tag', 'tag', 'nt.tagName = tag.name')
      .skip(page * limit)
      .take(limit)
      .orderBy('note.lastModification', !!orderByDateAsc ? 'ASC' : 'DESC');

    const result = await query.getMany();

    return result;
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
