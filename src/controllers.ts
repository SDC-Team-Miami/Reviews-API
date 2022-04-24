/* eslint-disable no-param-reassign */
import { Request, Response } from "express";
import AppDataSource, { characteristicReviewRepo, photoRepo, reviewRepo } from "./data-source";
import { getReviewQuery } from "./rawQueries";
import { Metadata, Recommended, Review } from "./types";

export const getReviews = (req: Request, res: Response) => {
  if (req.query.product_id === undefined) return res.sendStatus(404);

  const results: { product: string; page: number; count: number; results: Review[] } = {
    product: req.query.product_id.toString(),
    page: Number(req.query.page) || 1,
    count: Number(req.query.count) || 5,
    results: [],
  };

  return AppDataSource.manager.query(getReviewQuery).then((data) => {
    results.results = data.map((review: { row_to_json: Review }) => {
      if (!review.row_to_json.photos) review.row_to_json.photos = [];
      review.row_to_json.date += "T00:00:00.000Z";
      return review.row_to_json;
    });
    return res.send(results);
  });
};

export const getReviewMetadata = (req: Request, res: Response) => {
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
};

export const postReview = (req: Request, res: Response) => {
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
    .then((review) =>
      Promise.all(
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
        .then(() => res.sendStatus(201))
    );
  console.log(req.body);
};

export const putHelpful = (req: Request, res: Response) => {
  if (req.query.review_id === undefined) return res.sendStatus(404);
  return reviewRepo
    .increment({ id: Number(req.query.review_id) }, "helpfulness", 1)
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
};

export const putReport = (req: Request, res: Response) => {
  if (req.query.review_id === undefined) return res.sendStatus(404);
  return reviewRepo
    .update(Number(req.query.review_id), { reported: true })
    .then(() => res.sendStatus(204))
    .catch((err) => console.log(err));
};
