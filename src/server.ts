// imports from npm packages
import "reflect-metadata";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

// import router
import router from "./routes";

import AppDataSource from "./data-source";

const app = express();

// middleware
app.use(morgan("dev"));
app.use(cors());

app.use(router);

AppDataSource.initialize()
  .then(async () => {
    app.listen(process.env.PORT, () => {
      console.log(`listening on ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
