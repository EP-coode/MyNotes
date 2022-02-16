import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(private readonly conn: Connection) {}

  async countTags(userId: number) {
    const result: Array<{ tagName: string; count: string }> =
      await this.conn.query(
        `
      SELECT tag.name 'tagName', COUNT(*) 'count'
      FROM note
      RIGHT JOIN note_tags_tag
	      ON note.id = note_tags_tag.noteId AND note.creatorId = ?
      INNER JOIN tag
	      ON note_tags_tag.tagName = tag.name
      GROUP BY tag.name;`,
        [userId],
      );

    return result.reduce((acc, current) => {
      acc[current.tagName] = parseInt(current.count);
      return acc;
    }, {});
  }
}
