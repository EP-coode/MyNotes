import { Note } from 'src/notes/entities/note.entity';
import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryColumn({ type: 'varchar' })
  name: string;

  @ManyToMany(() => Note, (note) => note.tags)
  notes: Note[];
}
