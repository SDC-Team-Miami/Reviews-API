// imports from npm packages
import "reflect-metadata";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

// import router
import router from "./routes";

import AppDataSource from "./data-source";
import User from "./entity/User";

const app = express();

// middleware
app.use(morgan("dev"));
app.use(cors());

// use routes
app.use(router);

AppDataSource.initialize()
  .then(async () => {
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await AppDataSource.manager.save(user);
    console.log(`Saved a new user with id: ${user.id}`);

    console.log("Loading users from the database...");
    const users = await AppDataSource.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express / fastify / any other framework.");
  })
  .catch((error) => console.log(error));

//  start server
app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
