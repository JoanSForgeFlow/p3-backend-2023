import { Request, Router } from "express";
import prisma from "./prisma-client.js";
import { errorChecked, NotFoundError } from "./utils.js";

const router = Router();

router.get(
  "/",
  errorChecked(async (req, res) => {
    const bookings = await prisma.booking.findMany();
    res.status(200).json({ bookings });
  })
);

router.get(
  "/:id",
  errorChecked(async (req, res) => {
    const id = Number(req.params.id);
    const booking = await prisma.booking.findUnique({
      where: { id },
    });
    if (!booking) {
      throw new NotFoundError("Booking", id);
    }
    res.status(200).json({ booking });
  })
);

router.post(
  "/",
  errorChecked(async (req, res) => {
    const newBooking = await prisma.booking.create({ data: req.body });
    res.status(201).json({ booking: newBooking });
  })
);

export default router;
