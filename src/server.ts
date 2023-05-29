import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import restaurantsRouter from "./restaurants.ts";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/restaurants", restaurantsRouter);

const { SERVER_PORT } = process.env;
app.listen(SERVER_PORT, () => {
  console.log(`Restaurant API listening on :${SERVER_PORT}`);
});
