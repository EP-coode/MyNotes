import { IsNotEmpty, IsString } from 'class-validator';

export default class createNoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  categories: number[];
}
