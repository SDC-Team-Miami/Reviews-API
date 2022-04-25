import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ReviewsService } from "./reviews.service";

@Controller("reviews")
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  async getReviews(@Req() req: Request, @Res() res: Response) {
    return this.reviewsService.getReviews(req, res);
  }

  @Post()
  async addReview(@Req() req: Request, @Res() res: Response) {
    return this.addReview(req, res);
  }
  @Get("meta")
  async getReviewMetadata(
    @Query("product_id") productId: string,
    @Res() res: Response,
  ) {
    return this.reviewsService.getReviewMetadata(productId, res);
  }
  @Put("helpful")
  async putHelpful(@Query("review_id") reviewId: string, @Res() res: Response) {
    return this.reviewsService.putHelpfulness(reviewId, res);
  }
  @Put("report")
  async putReport(@Query("review_id") reviewId: string, @Res() res: Response) {
    return this.reviewsService.putReport(reviewId, res);
  }
}
