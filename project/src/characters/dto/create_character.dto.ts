import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CharacterStatus } from '../character-status.enum.ts';

export class CreateCharacterDto {
  @ApiProperty({ example: 'Tony Stark', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  real_name: string;

  @ApiProperty({ example: 'Iron Man', maxLength: 100, description: 'Debe ser único' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  alias: string;

  @ApiProperty({ example: 'Powered armor suit', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  main_power: string;

  @ApiProperty({ example: 85, minimum: 1, maximum: 100 })
  @IsInt()
  @Min(1)
  @Max(100)
  power_level: number;

  @ApiPropertyOptional({ enum: CharacterStatus, default: CharacterStatus.ACTIVE })
  @IsOptional()
  @IsEnum(CharacterStatus)
  status?: CharacterStatus;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  is_villain?: boolean;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 1,
    description: 'Id del equipo (debe existir y estar activo). Omitir o null = sin equipo',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  team_id?: number | null;
}
