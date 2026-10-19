import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharactersController } from './characters.controller.ts';
import { CharactersService } from './characters.service.ts';
import { Character } from './entities/character.entity.ts';
import { Team } from '../teams/entities/team.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Character, Team])],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService],
})
export class CharactersModule {}