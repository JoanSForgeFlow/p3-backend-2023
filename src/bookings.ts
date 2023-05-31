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
    const { customerId, restaurantId, bookingDate, bookingTime, numberOfPeople } = req.body;
    if (numberOfPeople <= 0) {
      res.status(400).json({ error: "Invalid number of people" });
      return;
    }
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!customer) {
      throw new NotFoundError("Customer", customerId);
    }
    if (!restaurant) {
      throw new NotFoundError("Restaurant", restaurantId);
    }
    // Fetch all tables of the restaurant
    const tables = await prisma.table.findMany({ where: { restaurantId } });
    // Filter for tables with sufficient capacity
    const suitableTables = tables.filter(table => table.capacity >= numberOfPeople);
    if (suitableTables.length === 0) {
      res.status(400).json({ error: "No tables available with sufficient capacity" });
      return;
    }
    const bookingDateTime = moment.utc(bookingDate);
    const bookingEndDateTime = moment.utc(bookingDateTime).add(1, 'hours').add(59, 'minutes');
    // Check availability of each table and select a table that is available
    let availableTableId = null;
    for (const table of suitableTables) {
      const existingBooking = await prisma.booking.findFirst({
        where: {
          tableId: table.id,
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
      if (!existingBooking) {
        availableTableId = table.id;
        break;
      }
    }
    if (availableTableId === null) {
      res.status(400).json({ error: "No available tables at the selected time" });
      return;
    }
    const newBooking = await prisma.booking.create({
      data: {
        customerId,
        tableId: availableTableId,
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

router.put(
  "/:id",
  errorChecked(async (req, res) => {
    const id = Number(req.params.id);
    const { bookingDate } = req.body;
    const existingBooking = await prisma.booking.findUnique({ where: { id } });
    if (!existingBooking) {
      throw new NotFoundError("Booking", id);
    }
    const bookingDateTime = moment.utc(bookingDate);
    const bookingEndDateTime = moment.utc(bookingDateTime).add(1, 'hours').add(59, 'minutes');
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        tableId: existingBooking.tableId,
        AND: {
          NOT: { id: id },
        },
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
    if (conflictingBooking) {
      res.status(400).json({ error: "The table is already booked for the selected date and time" });
      return;
    }
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        bookingDate: bookingDateTime.toDate(),
        bookingEndTime: bookingEndDateTime.toDate(),
      },
    });
    res.status(200).json({ booking: updatedBooking });
  })
);

router.delete(
  "/:id",
  errorChecked(async (req, res) => {
    const id = Number(req.params.id);
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundError("Booking", id);
    }
    await prisma.booking.delete({ where: { id } });
    res.status(200).json({ message: "Booking successfully deleted" });
  })
);

export default router;
