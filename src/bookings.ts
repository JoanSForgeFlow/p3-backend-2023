import { Request, Router } from "express";
import prisma from "./prisma-client.js";
import { errorChecked, NotFoundError } from "./utils.js";
import moment from 'moment';

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
    if (numberOfPeople <= 0) {
      res.status(400).json({ error: "Invalid number of people" });
      return;
    }
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    const table = await prisma.table.findUnique({ where: { id: tableId } });
    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!customer) {
      throw new NotFoundError("Customer", customerId);
    }
    if (!table) {
      throw new NotFoundError("Table", tableId);
    }
    if (!restaurant) {
      throw new NotFoundError("Restaurant", restaurantId);
    }
    if (numberOfPeople > table.capacity) {
      res.status(400).json({ error: "Number of people exceeds table capacity" });
      return;
    }
    const bookingDateTime = moment.utc(bookingDate);
    const bookingEndDateTime = moment.utc(bookingDateTime).add(1, 'hours').add(59, 'minutes');
    const existingBooking = await prisma.booking.findFirst({
      where: {
        tableId,
        OR: [
          {
            AND: [
              {
                bookingDate: {
                  lte: bookingDateTime.toDate(),
                },
                bookingEndTime: {
                  gte: bookingDateTime.toDate(),
                },
              },
            ],
          },
          {
            AND: [
              {
                bookingDate: {
                  lte: bookingEndDateTime.toDate(),
                },
                bookingEndTime: {
                  gte: bookingEndDateTime.toDate(),
                },
              },
            ],
          },
        ],
      },
    });

    if (existingBooking) {
      res.status(400).json({ error: "Table is already booked for the given date and time" });
      return;
    }
    const newBooking = await prisma.booking.create({
      data: {
        customerId,
        tableId,
        restaurantId,
        bookingDate: bookingDateTime.toDate(),
        bookingEndTime: bookingEndDateTime.toDate(),
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
