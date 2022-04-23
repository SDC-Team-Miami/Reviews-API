import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
class Review {
  @Index("review_id_index")
  @PrimaryGeneratedColumn()
  id: number;

  @Index("review_product_id_index")
  @Column()
  product_id: number;

  @Column()
  rating: number;

  @Column()
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
}

export default Review;
