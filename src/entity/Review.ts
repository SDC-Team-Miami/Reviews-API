import { Entity, PrimaryGeneratedColumn, Column, Index, Timestamp } from "typeorm";

@Entity()
class Review {
  @Index("review_id_index")
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Index("review_product_id_index")
  @Column()
  product_id: number;

  @Column()
  rating: number;

  @Column({
    nullable: true,
  })
  date: string;

  @Column()
  summary: string;

  @Column()
  body: string;

  @Column()
  recommend: boolean;

  @Column()
  reported: boolean;

  @Column()
  reviewer_name: string;

  @Column()
  reviewer_email: string;

  @Column({
    nullable: true,
  })
  response: string;

  @Column()
  helpfulness: number;

  @Column("timestamp")
  datetz: Timestamp;
}

export default Review;
