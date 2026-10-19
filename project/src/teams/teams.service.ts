import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { Team } from './entities/team.entity.ts';
import { Character } from '../characters/entities/character.entity.ts';
import { CreateTeamDto } from './dto/create_team.dto.ts';
import { UpdateTeamDto } from './dto/update_team.dto.ts';
import { AssignTeamCharactersDto } from './dto/assign_team_characters.dto.ts';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepo: Repository<Team>,
    @InjectRepository(Character)
    private readonly charactersRepo: Repository<Character>,
  ) {}

  findAll(): Promise<Team[]> {
    return this.teamsRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamsRepo.findOne({
      where: { id },
      relations: { characters: true },
    });
    if (!team) {
      throw new NotFoundException(`El equipo con id ${id} no fue encontrado`);
    }
    return team;
  }

  async findCharacters(id: number): Promise<Character[]> {
    await this.getTeamOrFail(id);
    return this.charactersRepo.find({
      where: { team_id: id },
      order: { id: 'ASC' },
    });
  }

  async create(dto: CreateTeamDto): Promise<Team> {
    await this.assertNameAvailable(dto.name);

    const active = dto.active ?? true;
    const characterIds = dto.characterIds ?? [];
    if (characterIds.length > 0) {
      if (!active) {
        throw new BadRequestException(
          'No se pueden asignar personajes a un equipo que se encuentra inactivo',
        );
      }
      await this.assertCharactersExist(characterIds);
    }

    const created = this.teamsRepo.create({
      name: dto.name,
      base: dto.base ?? null,
      founded_year: dto.founded_year ?? null,
      active,
    });
    const saved = await this.teamsRepo.save(created);

    if (characterIds.length > 0) {
      await this.charactersRepo.update(
        { id: In(characterIds) },
        { team_id: saved.id },
      );
    }
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateTeamDto): Promise<Team> {
    await this.getTeamOrFail(id);
    await this.assertNameAvailable(dto.name, id);

    await this.teamsRepo.update(id, {
      name: dto.name,
      base: dto.base ?? null,
      founded_year: dto.founded_year ?? null,
      active: dto.active ?? true,
    });
    return this.findOne(id);
  }

  async assignCharacters(id: number, dto: AssignTeamCharactersDto): Promise<Team> {
    const team = await this.getTeamOrFail(id);
    if (!team.active) {
      throw new BadRequestException(`El equipo "${team.name}" se encuentra inactivo`);
    }
    await this.assertCharactersExist(dto.characterIds);

    await this.charactersRepo.update(
      { id: In(dto.characterIds) },
      { team_id: id },
    );
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    const team = await this.getTeamOrFail(id);

    const hasCharacters = await this.charactersRepo.existsBy({ team_id: id });
    if (hasCharacters) {
      throw new ConflictException(
        `El equipo "${team.name}" cuenta con personajes asociados; para cerrarlo se debe desactivar o eliminar primero a los personajes`,
      );
    }

    await this.teamsRepo.delete(id);
    return { message: `El equipo ${team.name} fue eliminado`, id };
  }

  private async getTeamOrFail(id: number): Promise<Team> {
    const team = await this.teamsRepo.findOneBy({ id });
    if (!team) {
      throw new NotFoundException(`El equipo con id ${id} no fue encontrado`);
    }
    return team;
  }

  private async assertNameAvailable(
    name: string,
    excludeId?: number,
  ): Promise<void> {
    const where: FindOptionsWhere<Team> = { name };
    if (excludeId !== undefined) where.id = Not(excludeId);
    const duplicated = await this.teamsRepo.existsBy(where);
    if (duplicated) {
      throw new ConflictException(`Ya existe un equipo con el nombre "${name}"`);
    }
  }

  private async assertCharactersExist(ids: number[]): Promise<void> {
    const found = await this.charactersRepo.findBy({ id: In(ids) });
    const missing = ids.filter((id) => !found.some((c) => c.id === id));
    if (missing.length > 0) {
      throw new NotFoundException(
        `No existen los personajes con id: ${missing.join(', ')}`,
      );
    }
  }
}