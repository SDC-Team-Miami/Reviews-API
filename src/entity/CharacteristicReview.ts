import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity({ name: "characteristic_review" })
class CharacteristicReviews {
  @Index("characteristic_review_pkey")
  @PrimaryGeneratedColumn()
  id: number;

  @Index("characteristic_review_review_id_index")
  @Column()
  characteristic_id: number;

  @Column()
  review_id: number;

  @Column()
  value: number;
}

export default CharacteristicReviews;
