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

// router.get("/reviews/meta", (req: Request, res: Response) => {
//   Review.findAll({
//     attributes: ["rating"],
//     where: {
//       product_id: 100011,
//     },
//   })
//     .then((data) => {
//       const ratings: Object = {};
//       data.forEach((rating: Object) => {
//         ratings[rating.rating] = 1;
//       });
//       res.send(ratings);
//     })
//     .catch((err) => console.log(err));
// });

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
