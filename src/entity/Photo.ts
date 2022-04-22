import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  review_id: number;

  @Column()
  url: string;
}

export default Photo;
