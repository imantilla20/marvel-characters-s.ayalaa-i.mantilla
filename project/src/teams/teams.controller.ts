import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamsService } from './teams.service.ts';
import { Team } from './entities/team.entity.ts';
import { Character } from '../characters/entities/character.entity.ts';
import { CreateTeamDto } from './dto/create_team.dto.ts';
import { UpdateTeamDto } from './dto/update_team.dto.ts';
import { AssignTeamCharactersDto } from './dto/assign_team_characters.dto.ts';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOperation({ summary: 'Listado de todos los equipos' })
  @ApiResponse({ status: 200, description: 'Listado de equipos', type: [Team] })
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un equipo por medio de su id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'El equipo fue encontrado', type: Team })
  @ApiResponse({ status: 404, description: 'El equipo no fue encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }

  @Get(':id/characters')
  @ApiOperation({ summary: 'Listado de los personajes que pertenecen al equipo' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Los personajes del equipo', type: [Character] })
  @ApiResponse({ status: 404, description: 'El equipo no fue encontrado' })
  findCharacters(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findCharacters(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un equipo y añade sus characterIds de personas que quiere asociarle al equipo' })
  @ApiResponse({ status: 201, description: 'Equipo creado', type: Team })
  @ApiResponse({ status: 400, description: 'Los datos son inválidos o se envían personajes a un equipo inactivo' })
  @ApiResponse({ status: 404, description: 'Alguno de los personajes con los ids proporcionados no existe' })
  @ApiResponse({ status: 409, description: 'Ya existe un equipo con ese nombre' })
  create(@Body() dto: CreateTeamDto) {
    return this.teamsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualiza un equipo existente, reemplazando el equipo completo' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'EL equipo actualizado', type: Team })
  @ApiResponse({ status: 400, description: 'Los datos ingresados son inválidos' })
  @ApiResponse({ status: 404, description: 'El equipo no fue encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe otro equipo con ese nombre' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTeamDto) {
    return this.teamsService.update(id, dto);
  }

  @Patch(':id/characters')
  @ApiOperation({ summary: 'Asigna uno o varios personajes al equipo' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Los personajes fueron asignados al equipo', type: Team })
  @ApiResponse({ status: 400, description: 'Los datos son inválidos o el equipo está inactivo' })
  @ApiResponse({ status: 404, description: 'El equipo o alguno de los personajes no existe' })
  assignCharacters(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignTeamCharactersDto,
  ) {
    return this.teamsService.assignCharacters(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un equipo' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'El equipo fue eliminado' })
  @ApiResponse({ status: 404, description: 'El equipo no fue encontrado' })
  @ApiResponse({ status: 409, description: 'El equipo tiene personajes asociados' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.remove(id);
  }
}