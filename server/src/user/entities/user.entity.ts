import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Note } from 'src/notes/entities/note.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: false })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  emailConfirmed: boolean;

  @Column({ type: 'varchar', nullable: true })
  hashedRt?: string;

  @Column({ type: 'varchar', nullable: true })
  confirmationToken?: string;

  @OneToMany((type) => Note, (note) => note.creator, { onDelete: 'CASCADE' })
  notes: Note[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
