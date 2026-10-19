import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CharacterStatus } from '../character-status.enum.ts';

export class UpdateCharacterStatusDto {
  @ApiProperty({ enum: CharacterStatus, example: CharacterStatus.INJURED })
  @IsEnum(CharacterStatus)
  status: CharacterStatus;
}
