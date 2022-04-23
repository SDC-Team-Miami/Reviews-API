import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
class Characteristic {
  @Index("characteristic_pkey")
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column()
  name: string;
}

export default Characteristic;
