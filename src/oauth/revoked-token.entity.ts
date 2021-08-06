import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class RevokedToken {
  @PrimaryColumn()
  jti: string;

  @Column()
  expires: Date;
}
