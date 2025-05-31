import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    name: 'name',
    description: 'The name of the tag',
    type: String,
    example: 'Boardgames',
  })
  @IsString()
  @MaxLength(30)
  name: string;
}
