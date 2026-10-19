import { OmitType } from '@nestjs/swagger';
import { CreateTeamDto } from './create_team.dto.ts';

export class UpdateTeamDto extends OmitType(CreateTeamDto, ['characterIds'] as const) {}