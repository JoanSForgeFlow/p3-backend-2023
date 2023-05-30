import { Request, Router } from "express";
import prisma from "./prisma-client.js";
import { errorChecked } from "./utils.js";

const router = Router();

router.post(
  "/",
  errorChecked(async (req, res) => {
    const newRestaurant = await prisma.restaurant.create({ data: req.body });
    res.status(200).json({ newRestaurant, ok: true });
  })
);

export default router;
