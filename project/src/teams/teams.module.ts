import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsController } from './teams.controller.ts';
import { TeamsService } from './teams.service.ts';
import { Team } from './entities/team.entity.ts';
import { Character } from '../characters/entities/character.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Character])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}