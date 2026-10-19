import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, QueryFailedError, Repository } from 'typeorm';
import { CharacterStatus } from './character-status.enum.ts';
import { Character } from './entities/character.entity.ts';
import { Team } from '../teams/entities/team.entity.ts';
import { CreateCharacterDto } from './dto/create_character.dto.ts';
import { UpdateCharacterDto } from './dto/update_character.dto.ts';
import { UpdateCharacterStatusDto } from './dto/update_character_status.dto.ts';
import { FindCharactersDto } from './dto/find_characters.dto.ts';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly charactersRepo: Repository<Character>,
    @InjectRepository(Team)
    private readonly teamsRepo: Repository<Team>,
  ) {}

  findAll(query: FindCharactersDto): Promise<Character[]> {
    const where: FindOptionsWhere<Character> = {};
    if (query.status) where.status = query.status;
    if (query.teamId !== undefined) where.team_id = query.teamId;
    return this.charactersRepo.find({ where, order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Character> {
    const character = await this.charactersRepo.findOne({
      where: { id },
      relations: { team: true },
    });
    if (!character) {
      throw new NotFoundException(`El personaje con id ${id} no existe`);
    }
    return character;
  }

  async create(dto: CreateCharacterDto): Promise<Character> {
    await this.assertAliasAvailable(dto.alias); 
    if (dto.team_id != null) {
      await this.assertTeamAssignable(dto.team_id); 
    }

    try {
      const created = this.charactersRepo.create({
        real_name: dto.real_name,
        alias: dto.alias,
        main_power: dto.main_power,
        power_level: dto.power_level,
        status: dto.status ?? CharacterStatus.ACTIVE,
        is_villain: dto.is_villain ?? false,
        team_id: dto.team_id ?? null,
      });
      const saved = await this.charactersRepo.save(created);
      return this.findOne(saved.id);
    } catch (error) {
      this.rethrowIfDuplicateAlias(error, dto.alias);
      throw error;
    }
  }

  async update(id: number, dto: UpdateCharacterDto): Promise<Character> {
    const existing = await this.charactersRepo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`El personaje con id ${id} no existe`);
    }

    const newStatus = dto.status ?? CharacterStatus.ACTIVE;
    this.assertStatusTransition(existing.status, newStatus); 
    await this.assertAliasAvailable(dto.alias, id);
    if (dto.team_id != null) {
      await this.assertTeamAssignable(dto.team_id); 
    }

    try {
      await this.charactersRepo.update(id, {
        real_name: dto.real_name,
        alias: dto.alias,
        main_power: dto.main_power,
        power_level: dto.power_level,
        status: newStatus,
        is_villain: dto.is_villain ?? false,
        team_id: dto.team_id ?? null,
      });
    } catch (error) {
      this.rethrowIfDuplicateAlias(error, dto.alias);
      throw error;
    }
    return this.findOne(id);
  }

  async updateStatus(
    id: number,
    dto: UpdateCharacterStatusDto,
  ): Promise<Character> {
    const existing = await this.charactersRepo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`El personaje con id ${id} no existe`);
    }

    this.assertStatusTransition(existing.status, dto.status);
    await this.charactersRepo.update(id, { status: dto.status });
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    const existing = await this.charactersRepo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`El personaje con id ${id} no existe`);
    }
    await this.charactersRepo.delete(id);
    return { message: `El personaje ${existing.alias} fue eliminado`, id };
  }

  private async assertAliasAvailable(
    alias: string,
    excludeId?: number,
  ): Promise<void> {
    const where: FindOptionsWhere<Character> = { alias };
    if (excludeId !== undefined) where.id = Not(excludeId);
    const duplicated = await this.charactersRepo.existsBy(where);
    if (duplicated) {
      throw new ConflictException(
        `Ya existe un personaje con el alias "${alias}"`,
      );
    }
  }

  private async assertTeamAssignable(teamId: number): Promise<void> {
    const team = await this.teamsRepo.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(`El equipo con id ${teamId} no existe`);
    }
    if (!team.active) {
      throw new BadRequestException(`El equipo "${team.name}" está inactivo`);
    }
  }

  private assertStatusTransition(
    current: CharacterStatus,
    next: CharacterStatus,
  ): void {
    if (
      current === CharacterStatus.RETIRED &&
      next === CharacterStatus.INJURED
    ) {
      throw new BadRequestException(
        'Un personaje RETIRED no puede pasar directamente a INJURED; primero debe volver a ACTIVE',
      );
    }
  }

  private rethrowIfDuplicateAlias(error: unknown, alias: string): void {
    if (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { driverError?: { code?: string } })
        .driverError?.code === '23505'
    ) {
      throw new ConflictException(
        `Ya existe un personaje con el alias "${alias}"`,
      );
    }
  }
}
