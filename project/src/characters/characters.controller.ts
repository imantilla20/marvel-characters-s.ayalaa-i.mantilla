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
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CharactersService } from './characters.service.ts';
import { Character } from './entities/character.entity.ts';
import { CreateCharacterDto } from './dto/create_character.dto.ts';
import { UpdateCharacterDto } from './dto/update_character.dto.ts';
import { UpdateCharacterStatusDto } from './dto/update_character_status.dto.ts';
import { FindCharactersDto} from './dto/find_characters.dto.ts';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  @ApiOperation({ summary: 'Lista los personajes (filtros opcionales: status y teamId)' })
  @ApiResponse({ status: 200, description: 'Lista de personajes', type: [Character] })
  @ApiResponse({ status: 400, description: 'Filtro inválido (status o teamId)' })
  findAll(@Query() query: FindCharactersDto) {
    return this.charactersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un personaje por su id, incluyendo los datos de su equipo' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Personaje encontrado', type: Character })
  @ApiResponse({ status: 404, description: 'El personaje no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un personaje' })
  @ApiResponse({ status: 201, description: 'Personaje creado', type: Character })
  @ApiResponse({ status: 400, description: 'Datos inválidos o el equipo está inactivo' })
  @ApiResponse({ status: 404, description: 'El equipo (team_id) no existe' })
  @ApiResponse({ status: 409, description: 'Ya existe un personaje con ese alias' })
  create(@Body() dto: CreateCharacterDto) {
    return this.charactersService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Reemplaza el personaje completo' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Personaje actualizado', type: Character })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos, equipo inactivo o transición de estado no permitida (RETIRED -> INJURED)',
  })
  @ApiResponse({ status: 404, description: 'El personaje o el equipo (team_id) no existe' })
  @ApiResponse({ status: 409, description: 'Ya existe otro personaje con ese alias' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCharacterDto) {
    return this.charactersService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambia únicamente el estado (status) del personaje' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Estado actualizado', type: Character })
  @ApiResponse({
    status: 400,
    description: 'Estado inválido o transición no permitida (RETIRED -> INJURED)',
  })
  @ApiResponse({ status: 404, description: 'El personaje no existe' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCharacterStatusDto,
  ) {
    return this.charactersService.updateStatus(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un personaje' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Personaje eliminado' })
  @ApiResponse({ status: 404, description: 'El personaje no existe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.remove(id);
  }
}
