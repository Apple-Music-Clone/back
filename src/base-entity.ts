import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeepPartial,
} from 'typeorm';

export abstract class BaseEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  constructor(data: DeepPartial<T> = {}) {
    Object.assign(this, data);
  }
}
