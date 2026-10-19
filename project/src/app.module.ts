import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CharactersModule } from './characters/characters.module.ts';
import { TeamsModule } from './teams/teams.module.ts';
import { Character } from './characters/entities/character.entity.ts';
import { Team } from './teams/entities/team.entity.ts';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5433),
      username: process.env.DB_USER ?? 'marvel',
      password: process.env.DB_PASSWORD ?? 'marvel123',
      database: process.env.DB_NAME ?? 'marvel_db',
      entities: [Team, Character],
      // Se mantiene falso para que la API no pueda crear o modificar tablas.
      synchronize: false,
    }),
    CharactersModule,
    TeamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}