import { Router, Request, Response } from "express";
import AppDataSource from "./data-source";
import CharacteristicReview from "./entity/CharacteristicReview";
import Photo from "./entity/Photo";
import Review from "./entity/Review";

const router = Router();

const reviewRepo = AppDataSource.getRepository(Review);
const photoRepo = AppDataSource.getRepository(Photo);
const characteristicReviewRepo = AppDataSource.getRepository(CharacteristicReview);

type Ratings = Record<string, number>;

type Recommended = {
  [bool in "true" | "false"]: number;
};

type Characteristic = {
  id: number;
  value: string;
};

type Characteristics = {
  Fit?: Characteristic;
  Comfort?: Characteristic;
  Quality?: Characteristic;
  Size?: Characteristic;
  Length?: Characteristic;
  Width?: Characteristic;
};

interface Metadata {
  ratings: Ratings;
  recommended: Recommended;
  characteristics: Characteristics;
}

router.get("/reviews", (req: Request, res: Response) => {
  if (req.query.product_id === undefined) {
    return res.sendStatus(404);
  }
  const productId = Number(req.query.product_id);

  return reviewRepo
    .createQueryBuilder("review")
    .select([
      "review.id AS review_id",
      "rating",
      "summary",
      "recommend",
      "response",
      "body",
      "review.datetz AS date",
      "reviewer_name",
      "helpfulness",
    ])
    .where("review.product_id = :productId", { productId })
    .getRawMany()
    .then((data) =>
      Promise.all(
        data.map((review) =>
          photoRepo.find({
            select: {
              id: true,
              url: true,
            },
            where: {
              review_id: review.review_id,
            },
          })
        )
      ).then((photos) =>
        res.send({ results: data.map((review, i) => ({ ...review, photos: photos[i] })) })
      )
    );
});

router.get("/reviews/:product_id/list", (req: Request, res: Response) => {
  if (req.params.product_id === undefined) {
    return res.sendStatus(404);
  }
  const productId = Number(req.params.product_id);

  return reviewRepo
    .createQueryBuilder("review")
    .select([
      "review.id AS review_id",
      "rating",
      "summary",
      "recommend",
      "response",
      "body",
      "review.datetz AS date",
      "reviewer_name",
      "helpfulness",
    ])
    .where("review.product_id = :productId", { productId })
    .getRawMany()
    .then((data) =>
      Promise.all(
        data.map((review) =>
          photoRepo.find({
            select: {
              id: true,
              url: true,
            },
            where: {
              review_id: review.review_id,
            },
          })
        )
      ).then((photos) => res.send(data.map((review, i) => ({ ...review, photos: photos[i] }))))
    );
});

router.get("/reviews/:product_id/meta", (req: Request, res: Response) => {
  if (req.params.product_id === undefined) {
    return res.sendStatus(404);
  }
  const productId = Number(req.params.product_id);
  return reviewRepo
    .find({
      where: {
        product_id: productId,
      },
    })
    .then((data) => {
      const ratings: number[] = data.map((review) => review.rating);
      res.status(200).send({
        ratings: ratings.reduce((acc: Record<number, number>, current) => {
          if (acc[current] === undefined) {
            acc[current] = 1;
          } else {
            acc[current] += 1;
          }
          return acc;
        }, {}),
      });
    });
});

router.get("/reviews/meta", (req: Request, res: Response) => {
  if (req.query.product_id === undefined) {
    return res.sendStatus(404);
  }
  const productId = Number(req.query.product_id);
  const metadata: Metadata = {
    ratings: {},
    recommended: {
      true: 0,
      false: 0,
    },
    characteristics: {},
  };
  return reviewRepo
    .find({
      where: {
        product_id: productId,
      },
    })
    .then((data) => {
      metadata.ratings = data
        .map((review) => review.rating)
        .reduce((acc: Record<number, number>, current) => {
          if (acc[current] === undefined) {
            acc[current] = 1;
          } else {
            acc[current] += 1;
          }
          return acc;
        }, {});
      metadata.recommended = data
        .map((review) => review.recommend.toString())
        .reduce(
          (acc: Recommended, current: "true" | "false") => {
            acc[current] += 1;
            return acc;
          },
          { true: 0, false: 0 }
        );
      return Promise.all(
        data.map((review) =>
          AppDataSource.manager.query(
            `SELECT name, value, characteristic.id 
          FROM characteristic_review
          INNER JOIN characteristic 
          ON characteristic.id = characteristic_id
          WHERE review_id = ${review.id};`
          )
        )
      ).then((result) => {
        const characteristicTotals = result.reduce((acc, chars) => {
          chars.forEach((char: { id: number; name: string; value: string }) => {
            if (acc[char.name] === undefined) {
              acc[char.name] = { id: char.id, value: char.value };
            } else {
              acc[char.name].value += char.value;
            }
          });
          return acc;
        }, {});
        Object.keys(characteristicTotals).forEach((char) => {
          characteristicTotals[char].value /= result.length;
          characteristicTotals[char].value = characteristicTotals[char].value.toFixed(4);
        });
        metadata.characteristics = characteristicTotals;
        res.status(200).send(metadata);
      });
    });
});
/*

const user = createQueryBuilder("user")
    .innerJoin("user.photos", "photo")
    .where("user.name = :name", { name: "Timber" })
    .getOne()

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
  const { rating, summary, body, recommend, name, email, photos, characteristics } = req.body;
  return reviewRepo
    .insert({
      product_id: Number(req.params.product_id),
      rating,
      summary,
      body,
      recommend,
      reported: false,
      reviewer_name: name,
      reviewer_email: email,
      response: null,
      helpfulness: 0,
      datetz: new Date().toISOString().split("T")[0],
    })
    .then((review) => {
      console.log(review);
      return Promise.all(
        photos.map((url: string) =>
          photoRepo.insert({
            review_id: review.generatedMaps[0].id,
            url,
          })
        )
      )
        .then(() =>
          Promise.all(
            Object.keys(characteristics).map((charId) =>
              characteristicReviewRepo.insert({
                characteristic_id: Number(charId),
                review_id: review.generatedMaps[0].id,
                value: characteristics[charId],
              })
            )
          )
        )
        .then(() => res.sendStatus(201));
    });
  console.log(req.body);
});

router.put("/reviews/:review_id/helpful", (req: Request, res: Response) => {
  if (req.params.review_id === undefined) {
    return res.sendStatus(404);
  }
  const reviewId = Number(req.params.review_id);
  return reviewRepo
    .increment({ id: reviewId }, "helpfulness", 1)
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
});

router.put("/reviews/helpful", (req: Request, res: Response) => {
  if (req.query.review_id === undefined) {
    return res.sendStatus(404);
  }
  const reviewId = Number(req.query.review_id);
  return reviewRepo
    .increment({ id: reviewId }, "helpfulness", 1)
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
});

router.put("/reviews/:review_id/report", (req: Request, res: Response) => {
  if (req.params.review_id === undefined) {
    return res.sendStatus(404);
  }
  const reviewId = Number(req.params.review_id);
  return reviewRepo
    .update(reviewId, { reported: true })
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
});

router.put("/reviews/report", (req: Request, res: Response) => {
  if (req.query.review_id === undefined) {
    return res.sendStatus(404);
  }
  const reviewId = Number(req.query.review_id);
  return reviewRepo
    .update(reviewId, { reported: true })
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
});

export default router;
