import { Request, Router } from "express";
import prisma from "./prisma-client.js";
import { errorChecked } from "./utils.js";

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
    res.status(200).json({ table });
  })
);

router.get(
  "/restaurants/:id",
  errorChecked(async (req, res) => {
    const restaurantId = Number(req.params.id);
    const tables = await prisma.table.findMany({
      where: { restaurantId },
    });
    res.status(200).json({ tables });
  })
);

export default router;
