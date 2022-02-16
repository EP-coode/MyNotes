import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class Pagination {
  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit: number = 15;

  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page: number = 0;
}
