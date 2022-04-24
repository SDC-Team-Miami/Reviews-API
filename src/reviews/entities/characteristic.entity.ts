import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class Characteristic {
  @Index("characteristic_pkey")
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column()
  name: string;
}
