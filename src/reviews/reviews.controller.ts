import { Body, Controller, Get, Post, Put, Query } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";

@Controller("reviews")
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  async getReviews(@Query("product_id") productId: string) {
    return this.reviewsService.getReviews(productId);
  }

  @Post()
  async addReview(@Query("product_id") productId: string, @Body() reviewData: string) {
    return this.addReview(productId, reviewData);
  }
  @Get("meta")
  async getReviewMetadata(@Query("product_id") productId: string) {
    return this.reviewsService.getReviewMetadata(productId);
  }
  @Put("helpful")
  async putHelpful(@Query("review_id") reviewId: string) {
    return this.reviewsService.putHelpfulness(reviewId);
  }
  @Put("report")
  async putReport(@Query("review_id") reviewId: string) {
    return this.reviewsService.putReport(reviewId);
  }
}
