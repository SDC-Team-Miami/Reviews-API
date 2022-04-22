import "reflect-metadata";
import { DataSource } from "typeorm";
import User from "./entity/User";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "matt",
  password: "306366",
  database: "sdc",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;
