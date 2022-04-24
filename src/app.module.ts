import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Characteristic from "./reviews/entities/Characteristic";
import CharacteristicReviews from "./reviews/entities/CharacteristicReview";
import Photo from "./reviews/entities/Photo";
import Review from "./reviews/entities/Review";
import { ReviewsModule } from "./reviews/reviews.module";

@Module({
  imports: [
    ReviewsModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "matt",
      password: "306366",
      database: "sdc",
      entities: [Review, Photo, Characteristic, CharacteristicReviews],
      synchronize: false,
    }),
  ],
})
export class AppModule {}
