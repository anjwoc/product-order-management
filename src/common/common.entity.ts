import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' }) // timestamp with timezone
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' }) // timestamp with timezone
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' }) // timestamp with timezone
  deletedAt: Date | null;
}
