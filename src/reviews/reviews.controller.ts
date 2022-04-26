import { Controller, Get, Post, Put, Query, Req, Res } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { IRequest } from "src/types";
import { ReviewsService } from "./reviews.service";

@Controller("reviews")
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  async getReviews(@Req() req: IRequest, @Res() reply: FastifyReply) {
    return this.reviewsService.getReviews(req, reply);
  }

  @Post()
  async addReview(@Req() req: IRequest, @Res() reply: FastifyReply) {
    return this.reviewsService.postReview(req, reply);
  }
  @Get("meta")
  async getReviewMetadata(
    @Query("product_id") productId: string,
    @Res() reply: FastifyReply,
  ) {
    return this.reviewsService.getReviewMetadata(productId, reply);
  }
  @Put("helpful")
  async putHelpful(
    @Query("review_id") reviewId: string,
    @Res() reply: FastifyReply,
  ) {
    return this.reviewsService.putHelpfulness(reviewId, reply);
  }
  @Put("report")
  async putReport(
    @Query("review_id") reviewId: string,
    @Res() reply: FastifyReply,
  ) {
    return this.reviewsService.putReport(reviewId, reply);
  }
}
