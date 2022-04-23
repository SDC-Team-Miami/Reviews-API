import { Router, Request, Response } from "express";
import AppDataSource from "./data-source";
import Review from "./entity/Review";

const router = Router();

router.get("/reviews", (req: Request, res: Response) => {
  AppDataSource.manager
    .findOneBy(Review, {
      id: 1702658,
    })
    .then((data) => {
      res.send(data);
    });
});

router.get("/reviews/:product_id/meta", (req: Request, res: Response) => {
  if (req.params.product_id === undefined) {
    return res.sendStatus(404);
  }
  const productId = Number(req.params.product_id);
  return AppDataSource.manager
    .find(Review, {
      where: {
        product_id: productId,
      },
    })
    .then((data) => {
      const ratings: number[] = data.map((review) => review.rating);
      res.status(200).send(
        ratings.reduce((acc: Record<number, number>, current) => {
          if (acc[current] === undefined) {
            acc[current] = 1;
          } else {
            acc[current] += 1;
          }
          return acc;
        }, {})
      );
    });
});

router.get("/reviews/meta", (req: Request, res: Response) => {
  if (req.query.product_id === undefined) {
    return res.sendStatus(404);
  }
  const productId = Number(req.query.product_id);
  return AppDataSource.manager
    .find(Review, {
      where: {
        product_id: productId,
      },
    })
    .then((data) => {
      const ratings: number[] = data.map((review) => review.rating);
      res.status(200).send(
        ratings.reduce((acc: Record<number, number>, current) => {
          if (acc[current] === undefined) {
            acc[current] = 1;
          } else {
            acc[current] += 1;
          }
          return acc;
        }, {})
      );
    });
});
/*
POST /reviews
@param product_id INTEGER
@param rating INTEGER (1-5)
@param summary TEXT
@param body TEXT
@param recommend BOOL
@param name TEXT
@param email TEXT
@param photos [TEXT] (array of urls)
@param characteristics OBJECT Object of keys representing characteristic_id and values representing the review value for that characteristic. { "14": 5, "15": 5 //...}
Response: Status Code 201 CREATED
*/
router.post("/reviews/:product_id", (req: Request, res: Response) => {
  // format data from req.body
  // add date in milliseconds
  // insert review in review table
  // insert characteristics in characteristics_review table
  if (req.params.product_id === undefined) {
    return res.sendStatus(404);
  }
  console.log(req.body);
  return res.sendStatus(201);
});

router.put("/reviews/:review_id/helpful", (req: Request, res: Response) => {
  if (req.params.review_id === undefined) {
    return res.sendStatus(404);
  }
  const reviewId = Number(req.params.review_id);
  return AppDataSource.manager
    .increment(Review, { id: reviewId }, "helpfulness", 1)
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
});

router.put("/reviews/helpful", (req: Request, res: Response) => {
  if (req.query.review_id === undefined) {
    return res.sendStatus(404);
  }
  const reviewId = Number(req.query.review_id);
  return AppDataSource.manager
    .increment(Review, { id: reviewId }, "helpfulness", 1)
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
});

router.put("/reviews/:review_id/report", (req: Request, res: Response) => {
  if (req.params.review_id === undefined) {
    return res.sendStatus(404);
  }
  const reviewId = Number(req.params.review_id);
  return AppDataSource.manager
    .update(Review, reviewId, { reported: true })
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
});

router.put("/reviews/report", (req: Request, res: Response) => {
  if (req.query.review_id === undefined) {
    return res.sendStatus(404);
  }
  const reviewId = Number(req.query.review_id);
  return AppDataSource.manager
    .update(Review, reviewId, { reported: true })
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
});

export default router;
