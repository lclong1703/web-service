import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ length: 255 /*, unique: true*/ })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  key: string;

  @Column({ default: Status.INACTIVE })
  status: Status;

  @Column({ type: 'datetime', name: 'expire_code', nullable: true })
  expireCode: Date;
}
