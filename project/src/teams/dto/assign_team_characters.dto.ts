import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator';

export class AssignTeamCharactersDto {
  @ApiProperty({ type: [Number], example: [16, 17], description: 'Ids de los personajes que se asignan al equipo' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  characterIds: number[];
}