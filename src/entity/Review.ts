import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
class Review {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  product_id: number;

  @Column()
  rating: number;

  @Column({
    nullable: true,
  })
  date: string;

  @Column({
    nullable: true,
  })
  summary: string;

  @Column({
    nullable: true,
  })
  body: string;

  @Column()
  recommend: boolean;

  @Column()
  reported: boolean;

  @Column({
    nullable: true,
  })
  reviewer_name: string;

  @Column({
    nullable: true,
  })
  reviewer_email: string;

  @Column({
    nullable: true,
  })
  response: string;

  @Column()
  helpfulness: number;
}

export default Review;
