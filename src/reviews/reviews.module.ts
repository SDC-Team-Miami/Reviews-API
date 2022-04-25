import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Characteristic } from "./entities/characteristic.entity";
import { CharacteristicReview } from "./entities/characteristicReview.entity";
import { Photo } from "./entities/photo.entity";
import { Review } from "./entities/review.entity";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [
    TypeOrmModule.forFeature([
      Review,
      Photo,
      Characteristic,
      CharacteristicReview,
    ]),
  ],
})
export class ReviewsModule {}
