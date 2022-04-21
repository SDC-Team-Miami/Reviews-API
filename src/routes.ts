import { Router, Request, Response } from "express";
import { Review } from "./db";

const router = Router();
interface RatingsInt {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}
// routes
router.get("/reviews", (req: Request, res: Response) => {
  Review.findAll({
    where: {
      product_id: 100001,
    },
  }).then((data) => res.send(data));
});

router.get("/reviews/meta", (req: Request, res: Response) => {
  Review.findAll({
    attributes: ["rating"],
    where: {
      product_id: 100011,
    },
  })
    .then((data) => {
      res.send(
        data
          .map((rating) => rating.get("rating"))
          .reduce((acc: RatingsInt, rating) => {
            if (rating !== undefined) {
              if (acc[rating as keyof typeof acc] === undefined) {
                acc[rating as keyof typeof acc] = 1;
              } else {
                acc[rating as keyof typeof acc] = acc[rating as keyof typeof acc] + 1;
              }
            }
            return acc;
          }, {})
      );
      // res.send(data);
    })
    .catch((err) => console.log(err));
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
