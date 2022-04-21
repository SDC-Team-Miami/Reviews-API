import "dotenv/config";
import express from "express";
import morgan from "morgan";

import router from "./routes";

const app = express();

app.use(morgan("dev"));
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
