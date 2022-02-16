import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Pagination } from 'src/common/dtos/pagination.dto';

export class NotesQueryParameters extends Pagination {
  @ApiProperty({ required: false })
  phrase: string;

  @ApiProperty({ default: false, required: false })
  orderByDateAsc: boolean = false;
}
