import { Request, Router } from "express";
import prisma from "./prisma-client.js";
import { errorChecked, NotFoundError } from "./utils.js";

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
      throw new NotFoundError('Restaurant', id);
    } else {
      res.status(200).json({ restaurant });
    }
  })
);

router.put(
  "/:id",
  errorChecked(async (req, res) => {
    console.log('Request body:', req.body);
    const id = Number(req.params.id);
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: req.body,
    });
    console.log('Updated restaurant:', updatedRestaurant);
    res.status(200).json({ updatedRestaurant });
  })
);

router.delete(
  "/:id",
  errorChecked(async (req, res) => {
    const id = Number(req.params.id);
    const deletedRestaurant = await prisma.restaurant.delete({ where: { id } });
    res.status(200).json({ deletedRestaurant });
  })
);

export default router;
