import "reflect-metadata";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import router from "./routes";

import AppDataSource from "./data-source";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use(router);

AppDataSource.initialize()
  .then(async () => {
    app.listen(process.env.PORT, () => {
      console.log(`listening on ${process.env.SERVERPORT}`);
    });
  })
  .catch((error) => console.log(error));
