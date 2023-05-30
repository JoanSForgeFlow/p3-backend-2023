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

router.get(
  "/",
  errorChecked(async (req, res) => {
    const restaurants = await prisma.restaurant.findMany();
    res.status(200).json({ restaurants });
  })
);

router.get(
  "/:id",
  errorChecked(async (req, res) => {
    const id = Number(req.params.id);
    const restaurant = await prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
    } else {
      res.status(200).json({ restaurant });
    }
  })
);

export default router;
