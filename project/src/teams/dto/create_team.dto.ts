import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Defenders', maxLength: 100, description: 'Debe ser único' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'New York', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  base?: string | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 1971, minimum: 1900, maximum: 2100 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  founded_year?: number | null;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    type: [Number],
    example: [16, 17],
    description: 'Ids de los personajes (existentes) que se asignan al equipo. Omitir o vacío = sin personajes',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  characterIds?: number[];
}