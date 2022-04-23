import "reflect-metadata";
import { DataSource } from "typeorm";
import Photo from "./entity/Photo";
import Review from "./entity/Review";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "matt",
  password: "306366",
  database: "sdc",
  // synchronize: true,
  logging: false,
  entities: [Photo, Review],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;
