import { Router, Request, Response } from "express";
import AppDataSource from "./data-source";
import Review from "./entity/Review";

const router = Router();
const productId = 100011;
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

router.get("/reviews/meta", (req: Request, res: Response) =>
  AppDataSource.manager
    .find(Review, {
      where: {
        product_id: 100011,
      },
    })
    .then((data) => {
      res.send(data);
    })
);

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
