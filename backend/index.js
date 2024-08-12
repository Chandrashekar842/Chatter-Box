import express from "express";
import cors from "cors";

import { dbConnect } from "./config/dbConnect.js";
import { notFound, errorHandler } from "./middleware/errMiddleware.js";
import { authRouter } from "./routes/authRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { chatRouter } from "./routes/chatRouter.js";
import { messageRouter } from "./routes/messageRouter.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use('/auth', authRouter)

app.use('/user', userRouter)

app.use('/chat', chatRouter)

app.use('/message', messageRouter)

app.use(notFound)

app.use(errorHandler)

dbConnect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Connected to the server at port:", process.env.PORT);
  });
});
