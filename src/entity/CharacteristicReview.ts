import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
class CharacteristicReviews {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  characteristic_id: number;

  @Column()
  review_id: number;

  @Column()
  value: number;
}

export default CharacteristicReviews;