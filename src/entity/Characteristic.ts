import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
class Characteristic {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  product_id: number;

  @Column()
  name: string;
}

export default Characteristic;
