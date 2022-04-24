import { Injectable } from "@nestjs/common";

@Injectable({})
export class ReviewsService {
  getReviews(productId: string): string {
    return productId;
  }
  //TODO: update review type
  postReview(productId: number, review: string) {
    return [productId, review];
  }
  getReviewMetadata(productId: string) {
    return productId;
  }
  putHelpfulness(reviewId: string) {
    return reviewId;
  }
  putReport(reviewId: string) {
    return reviewId;
  }
}
