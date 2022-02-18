import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Note {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  lastModification: Date;

  @ApiProperty()
  @Column({ type: 'varchar', length: 64 })
  title: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 1024 })
  content: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @ManyToOne((type) => User, (user) => user.notes)
  creator: User;

  @ApiProperty()
  @ManyToMany(() => Tag, (tag) => tag.notes, {
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  tags: Tag[];
}
