import "reflect-metadata";
import { DataSource } from "typeorm";
import CharacteristicReview from "./entity/CharacteristicReview";
import Characteristic from "./entity/Characteristic";
import Photo from "./entity/Photo";
import Review from "./entity/Review";

const { host, port, username, password, database } = process.env;

const AppDataSource = new DataSource({
  type: "postgres",
  host,
  port: Number(port),
  username,
  password,
  database,
  synchronize: false,
  logging: [],
  entities: [Photo, Review, CharacteristicReview, Characteristic],
  migrations: [],
  subscribers: [],
  maxQueryExecutionTime: 50,
  cache: true,
});
export const reviewRepo = AppDataSource.getRepository(Review);
export const photoRepo = AppDataSource.getRepository(Photo);
export const characteristicReviewRepo = AppDataSource.getRepository(CharacteristicReview);

export default AppDataSource;
