import express from "express";
import cors from "cors";

import { dbConnect } from "./config/dbConnect.js";

const app = express();

app.use(express.json());

app.use(cors());

dbConnect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Connected to the server at port:", process.env.PORT);
  });
});
