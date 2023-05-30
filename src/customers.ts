import { Request, Router } from "express";
import prisma from "./prisma-client.js";
import { errorChecked, NotFoundError } from "./utils.js";

const router = Router();

router.get(
  "/",
  errorChecked(async (req, res) => {
    const customers = await prisma.customer.findMany();
    res.status(200).json({ customers });
  })
);

router.get(
    "/:id",
    errorChecked(async (req, res) => {
      const id = Number(req.params.id);
      const customer = await prisma.customer.findUnique({
        where: { id },
      });
      if (!customer) {
        throw new NotFoundError("Customer", id);
      }
      res.status(200).json({ customer });
    })
  );

export default router;
