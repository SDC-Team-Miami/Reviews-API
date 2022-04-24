import { Router } from "express";
import { getReviewMetadata, getReviews, postReview, putHelpful, putReport } from "./controllers";

const router = Router();

router.get("/reviews", getReviews);

router.get("/reviews/meta", getReviewMetadata);

router.post("/reviews/:product_id", postReview);

router.put("/reviews/helpful", putHelpful);

router.put("/reviews/report", putReport);

export default router;
