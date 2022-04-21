// imports from npm packages
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

// import router
import router from "./routes";

const app = express();

// middleware
app.use(morgan("dev"));
app.use(cors());

// use routes
app.use(router);

//  start server
app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
