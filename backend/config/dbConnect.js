import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dbConnect = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("connected to database!!");
    })
    .catch((err) => {
      console.log("unable to connect to mongoDB Atlas!");
      console.log(err);
    });
};
