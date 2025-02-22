import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import restaurantsRouter from "./restaurants.js";
import tablesRouter from "./tables.js";
import customersRouter from "./customers.js";
import bookingRouter from "./bookings.js";
import reviewRouter from "./reviews.js"
import { defaultErrorHandler } from './utils.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/restaurants", restaurantsRouter);
app.use("/tables", tablesRouter);
app.use("/customers", customersRouter);
app.use("/bookings", bookingRouter);
app.use("/reviews", reviewRouter);
app.use(defaultErrorHandler);

const { SERVER_PORT } = process.env;
app.listen(SERVER_PORT, () => {
  console.log(`Restaurant API listening on :${SERVER_PORT}`);
});
