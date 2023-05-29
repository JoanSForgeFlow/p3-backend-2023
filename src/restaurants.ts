import { Request, Router } from "express";
import prisma from "./prisma-client.ts";
import { errorChecked } from "./utils.ts";

const router = Router();

router.post(
  "/",
  errorChecked(async (req, res) => {
    const newRestaurant = await prisma.restaurant.create({ data: req.body });
    res.status(200).json({ newRestaurant, ok: true });
  })
);

export default router;
