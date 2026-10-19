import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { CharacterStatus } from '../character-status.enum.ts';

export class FindCharactersDto {
  @ApiPropertyOptional({ enum: CharacterStatus, description: 'Filtra por estado' })
  @IsOptional()
  @IsEnum(CharacterStatus)
  status?: CharacterStatus;

  @ApiPropertyOptional({ type: Number, example: 1, description: 'Filtra por id del equipo' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  teamId?: number;
}
