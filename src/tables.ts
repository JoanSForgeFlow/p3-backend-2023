import { Request, Router } from "express";
import prisma from "./prisma-client.js";
import { errorChecked, NotFoundError } from "./utils.js";

const router = Router();

router.get(
  "/",
  errorChecked(async (req, res) => {
    const tables = await prisma.table.findMany();
    res.status(200).json({ tables });
  })
);

router.get(
  "/:id",
  errorChecked(async (req, res) => {
    const id = Number(req.params.id);
    const table = await prisma.table.findUnique({
      where: { id },
    });
    if (!table) {
      throw new NotFoundError("Table", id);
    }
    res.status(200).json({ table });
  })
);

router.get(
  "/restaurants/:id",
  errorChecked(async (req, res) => {
    const restaurantId = Number(req.params.id);
    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) {
      throw new NotFoundError("Restaurant", restaurantId);
    }
    const tables = await prisma.table.findMany({
      where: { restaurantId },
    });
    res.status(200).json({ tables });
  })
);

router.post(
  "/",
  errorChecked(async (req, res) => {
    const newTable = await prisma.table.create({ data: req.body });
    res.status(201).json({ newTable });
  })
);

router.put(
  "/:id",
  errorChecked(async (req, res) => {
    const id = Number(req.params.id);
    const table = await prisma.table.findUnique({
      where: { id },
    });
    if (!table) {
      return res.status(404).json({ error: `Table with ID ${id} not found` });
    }
    const updatedTable = await prisma.table.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json({ updatedTable });
  })
);

router.delete(
  "/:id",
  errorChecked(async (req, res) => {
    const id = Number(req.params.id);
    const deletedTable = await prisma.table.delete({
      where: { id },
    });
    res.status(200).json({ deletedTable });
  })
);

export default router;
