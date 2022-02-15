import { type } from 'os';
import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  lastModification: Date;

  @Column({ type: 'varchar', length: 64 })
  title: string;

  @Column({ type: 'varchar', length: 1024 })
  content: string;

  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @ManyToOne((type) => User, (user) => user.notes)
  creator: User;
}
