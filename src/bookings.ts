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
    const { customerId, tableId, restaurantId, bookingDate, bookingTime, numberOfPeople } = req.body;
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    const table = await prisma.table.findUnique({ where: { id: tableId } });
    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!customer) {
      res.status(400).json({ error: "Customer not found" });
      return;
    }
    if (!table) {
      res.status(400).json({ error: "Table not found" });
      return;
    }
    if (!restaurant) {
      res.status(400).json({ error: "Restaurant not found" });
      return;
    }
    const newBooking = await prisma.booking.create({
      data: {
        customerId,
        tableId,
        restaurantId,
        bookingDate,
        bookingTime,
        numberOfPeople,
      },
    });
    res.status(201).json({ booking: newBooking });
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
    const bookings = await prisma.booking.findMany({ where: { restaurantId } });
    res.status(200).json({ bookings });
  })
);

router.get(
  "/customers/:id",
  errorChecked(async (req, res) => {
    const customerId = Number(req.params.id);
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      throw new NotFoundError("Customer", customerId);
    }
    const bookings = await prisma.booking.findMany({ where: { customerId } });
    res.status(200).json({ bookings });
  })
);

export default router;
