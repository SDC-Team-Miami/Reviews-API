import express, { Request, Response } from "express";
import morgan from "morgan";
// import db from './db';

const app = express();

app.use(morgan("dev"));

app.get("/reviews", (req: Request, res: Response) => {
  res.send("hello");
});

app.listen(8000, () => {
  console.log("listening on 8000");
});
