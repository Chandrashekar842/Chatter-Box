import express from "express";
import cors from "cors";

import { dbConnect } from "./config/dbConnect.js";
import { authRouter } from "./routes/authRouter.js";
import { notFound, errorHandler } from "./middleware/errMiddleware.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use('/auth', authRouter)

app.use(notFound)

app.use(errorHandler)

dbConnect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Connected to the server at port:", process.env.PORT);
  });
});
