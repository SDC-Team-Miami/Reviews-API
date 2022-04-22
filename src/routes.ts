import { Router, Request, Response } from "express";
import AppDataSource from "./data-source";
import Review from "./entity/Review";

const router = Router();

// routes
router.get("/reviews", (req: Request, res: Response) => {
  AppDataSource.manager
    .findOneBy(Review, {
      id: 1702658,
    })
    .then((data) => {
      res.send(data);
    });
});
// add query params
router.get("/reviews/meta", (req: Request, res: Response) =>
  AppDataSource.manager
    .find(Review, {
      where: {
        product_id: 100011,
      },
    })
    .then((data) => {
      const ratings: number[] = data.map((review) => review.rating);
      res.send(
        ratings.reduce((acc: Record<number, number>, current) => {
          if (acc[current] === undefined) {
            acc[current] = 1;
          } else {
            acc[current] += 1;
          }
          return acc;
        }, {})
      );
    })
);

router.post("/reviews/", (req: Request, res: Response) => {
  res.status(201);
});
// add query param for review id
router.put("/reviews/helpful", (req: Request, res: Response) => {
  AppDataSource.manager
    .increment(Review, { id: 1702658 }, "helpfulness", 1)
    .then(() => res.send("hello"))
    .catch((err) => console.log(err));
});
router.put("/reviews/:reviewId/report", (req: Request, res: Response) => {
  res.status(204);
});

export default router;
