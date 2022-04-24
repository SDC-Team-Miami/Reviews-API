import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class Photo {
  @Index("photo_pkey")
  @PrimaryGeneratedColumn()
  id: number;

  @Index("photo_review_id_index")
  @Column()
  review_id: number;

  @Column()
  url: string;
}
