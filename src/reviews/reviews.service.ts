import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { IMetadata, IRecommended, IRequest } from "src/types";
import { CharacteristicReview } from "./entities/characteristicReview.entity";
import { FastifyReply } from "fastify";
import { getReviewQuery } from "src/rawQueries";

@Injectable({})
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(CharacteristicReview)
    private characteristicReviewRepo: Repository<CharacteristicReview>,
  ) {}

  getReviews(req: IRequest, reply: FastifyReply) {
    if (!req.query.product_id) return reply.code(404);

    const results: {
      product: string;
      page: number;
      count: number;
      results: Review[];
    } = {
      product: req.query.product_id.toString(),
      page: Number(req.query.page) || 1,
      count: Number(req.query.count) || 5,
      results: [],
    };

    return this.reviewRepo
      .query(getReviewQuery(results.product))
      .then((reviewData) => {
        results.results = reviewData;
        return reply.send(results);
      });
  }

  postReview(req: IRequest, reply: FastifyReply) {
    if (req.query.product_id === undefined) return reply.code(404);

    return this.reviewRepo
      .insert({
        product_id: Number(req.query.product_id),
        rating: req.body.rating,
        summary: req.body.summary,
        body: req.body.body,
        recommend: req.body.recommend,
        reported: false,
        reviewer_name: req.body.name,
        reviewer_email: req.body.email,
        response: null,
        helpfulness: 0,
        date: new Date().toISOString(),
        photos: req.body.photos,
      })
      .then((review) =>
        Promise.all(
          Object.keys(req.body.characteristics).map((charId: string) =>
            this.characteristicReviewRepo.insert({
              characteristic_id: Number(charId),
              review_id: review.generatedMaps[0].id,
              value: req.body.characteristics[charId],
            }),
          ),
        ),
      )
      .then(() => reply.send());
  }

  getReviewMetadata(productId: string, reply: FastifyReply) {
    if (productId === undefined) return reply.code(404);

    const metadata: IMetadata = {
      ratings: {},
      recommended: {
        true: 0,
        false: 0,
      },
      characteristics: {},
    };
    // find review using product ID
    return (
      this.reviewRepo
        .find({
          where: {
            product_id: Number(productId),
          },
        })
        // format ratings
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
          // format recommended
          metadata.recommended = data
            .map((review) => review.recommend.toString())
            .reduce(
              (acc: IRecommended, current: "true" | "false") => {
                acc[current] += 1;
                return acc;
              },
              { true: 0, false: 0 },
            );
          // get characteristic details from db
          return (
            Promise.all(
              data.map((review) =>
                this.reviewRepo.query(
                  `SELECT name, value, characteristic.id
            FROM characteristic_review
            INNER JOIN characteristic
            ON characteristic.id = characteristic_id
            WHERE review_id = ${review.id};`,
                ),
              ),
            )
              // format and add up characteristic values
              .then((result) => {
                const characteristicTotals = result.reduce((acc, chars) => {
                  chars.forEach(
                    (char: { id: number; name: string; value: string }) => {
                      if (acc[char.name] === undefined) {
                        acc[char.name] = { id: char.id, value: char.value };
                      } else {
                        acc[char.name].value += char.value;
                      }
                    },
                  );
                  return acc;
                }, {});
                // get average of characteristic sums
                Object.keys(characteristicTotals).forEach((char) => {
                  characteristicTotals[char].value /= result.length;
                  characteristicTotals[char].value =
                    characteristicTotals[char].value.toFixed(4);
                });
                metadata.characteristics = characteristicTotals;
                reply.status(200).send(metadata);
              })
          );
        })
    );
  }
  putHelpfulness(reviewId: string, reply: FastifyReply) {
    if (reviewId === undefined) return reply.code(404).send("Not found");
    return this.reviewRepo
      .increment({ id: Number(reviewId) }, "helpfulness", 1)
      .then(() => reply.code(204))
      .catch((err) => console.log(err));
  }
  putReport(reviewId: string, reply: FastifyReply) {
    if (reviewId === undefined) return reply.code(404);
    return this.reviewRepo
      .update(Number(reviewId), { reported: true })
      .then(() => reply.code(204))
      .catch((err) => console.log(err));
  }
}
