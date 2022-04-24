import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { Photo } from "./entities/photo.entity";
import { Metadata, Recommended, ReviewType } from "src/types";
import { getReviewQuery } from "src/rawQueries";
import { CharacteristicReview } from "./entities/characteristicReview.entity";

@Injectable({})
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(Photo)
    private photoRepo: Repository<Photo>,
    @InjectRepository(CharacteristicReview)
    private characteristicReviewRepo: Repository<CharacteristicReview>
  ) {}

  getReviews(req: Request, res: Response) {
    if (req.query.product_id === undefined) return res.sendStatus(404);

    const results: { product: string; page: number; count: number; results: Review[] } = {
      product: req.query.product_id.toString(),
      page: Number(req.query.page) || 1,
      count: Number(req.query.count) || 5,
      results: [],
    };

    return this.reviewRepo.query(getReviewQuery).then((data) => {
      results.results = data.map((review: { row_to_json: ReviewType }) => {
        if (!review.row_to_json.photos) review.row_to_json.photos = [];
        review.row_to_json.date += "T00:00:00.000Z";
        return review.row_to_json;
      });
      return res.send(results);
    });
  }
  //TODO: update review type
  postReview(req: Request, res: Response) {
    if (req.params.product_id === undefined) return res.sendStatus(404);
    const { rating, summary, body, recommend, name, email, photos, characteristics } = req.body;
    return this.reviewRepo
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
            this.photoRepo.insert({
              review_id: review.generatedMaps[0].id,
              url,
            })
          )
        )
          .then(() =>
            Promise.all(
              Object.keys(characteristics).map((charId) =>
                this.characteristicReviewRepo.insert({
                  characteristic_id: Number(charId),
                  review_id: review.generatedMaps[0].id,
                  value: characteristics[charId],
                })
              )
            )
          )
          .then(() => res.sendStatus(201))
      );
  }

  getReviewMetadata(productIds: string, res: Response) {
    if (productIds === undefined) return res.sendStatus(404);
    const productId = Number(productIds);
    const metadata: Metadata = {
      ratings: {},
      recommended: {
        true: 0,
        false: 0,
      },
      characteristics: {},
    };
    return this.reviewRepo
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
            this.reviewRepo.query(
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
  }
  putHelpfulness(reviewId: string, res: Response) {
    if (reviewId === undefined) return res.sendStatus(404);
    return this.reviewRepo
      .increment({ id: Number(reviewId) }, "helpfulness", 1)
      .then(() => res.sendStatus(204))
      .catch((err) => console.log(err));
  }
  putReport(reviewId: string, res: Response) {
    if (reviewId === undefined) return res.sendStatus(404);
    return this.reviewRepo
      .update(Number(reviewId), { reported: true })
      .then(() => res.sendStatus(204))
      .catch((err) => console.log(err));
  }
}
