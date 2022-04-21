import { Router, Request, Response } from "express";
import { Review } from "./db";

const router = Router();

// routes
router.get("/reviews", (req: Request, res: Response) => {
  Review.findAll({
    where: {
      product_id: 100001,
    },
  }).then((data) => res.send(data));
});
router.get("/reviews/meta", (req: Request, res: Response) => {
  res.send("/reviews/meta");
});
router.post("/reviews/", (req: Request, res: Response) => {
  res.status(201);
});
router.put("/reviews/:reviewId/helpful", (req: Request, res: Response) => {
  res.status(204);
});
router.put("/reviews/:reviewId/report", (req: Request, res: Response) => {
  res.status(204);
});

export default router;
