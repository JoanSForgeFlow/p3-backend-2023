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

router.post(
  "/",
  errorChecked(async (req, res) => {
    const newCustomer = await prisma.customer.create({
      data: req.body,
    });
    res.status(201).json({ customer: newCustomer });
  })
);

router.put(
  "/:id",
  errorChecked(async (req, res) => {
    const id = Number(req.params.id);
    const customer = await prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      return res.status(404).json({ error: `Customer with ID ${id} not found` });
    }
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json({ customer: updatedCustomer });
  })
);

router.delete(
  "/:id",
  errorChecked(async (req, res) => {
    const id = Number(req.params.id);
    const customer = await prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      return res.status(404).json({ error: `Customer with ID ${id} not found` });
    }
    const deletedCustomer = await prisma.customer.delete({
      where: { id },
    });
    res.status(200).json({ customer: deletedCustomer });
  })
);


export default router;
