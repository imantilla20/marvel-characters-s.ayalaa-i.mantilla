import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Character } from '../../characters/entities/character.entity.ts';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  base: string | null;

  @Column({ type: 'int', nullable: true })
  founded_year: number | null;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @OneToMany(() => Character, (character) => character.team)
  characters: Character[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}