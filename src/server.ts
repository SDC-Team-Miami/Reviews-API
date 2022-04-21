import "dotenv/config";
import express from "express";
import morgan from "morgan";

import router from "./routes";

const app = express();

app.use(morgan("dev"));
app.use(router);

app.listen(8000, () => {
  console.log("listening on 8000");
});
