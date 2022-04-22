import { Router, Request, Response } from "express";
import { Review, sequelize } from "./db";

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
      product_id: 294739,
    },
  })
    .then((data) => {
      console.log(data[0] instanceof Review);
      res.send(data);
    })
    .catch((err) => console.log(err));
});

router.get("/reviews/meta", (req: Request, res: Response) => {
  sequelize.query("SELECT review.rating FROM review WHERE product_id = 100011;").then((data) => {
    res.send({
      ratings: data[0].reduce((acc: any, rating: any) => {
        if (acc[rating.rating] === undefined) {
          return { ...acc, [rating.rating]: 1 };
        }
        acc[rating.rating] += 1;
        return acc;
      }, {}),
    });
  });
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
