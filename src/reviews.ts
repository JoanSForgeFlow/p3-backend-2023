import { Request, Router } from "express";
import prisma from "./prisma-client.js";
import { errorChecked, NotFoundError } from "./utils.js";

const router = Router();

router.get(
  "/",
  errorChecked(async (req, res) => {
    const reviews = await prisma.review.findMany();
    res.status(200).json({ reviews });
  })
);

router.get(
  "/:id",
  errorChecked(async (req, res) => {
    const id = Number(req.params.id);
    const review = await prisma.review.findUnique({
      where: { id },
    });
    if (!review) {
      throw new NotFoundError("Review", id);
    }
    res.status(200).json({ review });
  })
);

router.post(
  "/",
  errorChecked(async (req, res) => {
    const { customerId, restaurantId, rating, comment } = req.body;
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!customer) {
      throw new NotFoundError("Customer", customerId);
    }
    if (!restaurant) {
      throw new NotFoundError("Restaurant", restaurantId);
    }
    const newReview = await prisma.review.create({
      data: {
        customerId,
        restaurantId,
        rating,
        comment,
        date: new Date(),
      },
    });
    res.status(201).json({ review: newReview });
  })
);

router.put(
  "/:id",
  errorChecked(async (req, res) => {
    const id = Number(req.params.id);
    const { rating, comment } = req.body;
    const updatedReview = await prisma.review.update({
      where: { id },
      data: { rating, comment },
    });
    if (!updatedReview) {
      throw new NotFoundError("Review", id);
    }
    res.status(200).json({ review: updatedReview });
  })
);

router.delete(
  "/:id",
  errorChecked(async (req, res) => {
    const id = Number(req.params.id);
    const deletedReview = await prisma.review.delete({ where: { id } });
    if (!deletedReview) {
      throw new NotFoundError("Review", id);
    }
    res.status(200).json({ message: "Review deleted successfully" });
  })
);

router.get(
  "/customers/:id",
  errorChecked(async (req, res) => {
    const customerId = Number(req.params.id);
    const reviews = await prisma.review.findMany({ where: { customerId } });
    res.status(200).json({ reviews });
  })
);

router.get(
  "/restaurants/:id",
  errorChecked(async (req, res) => {
    const restaurantId = Number(req.params.id);
    const reviews = await prisma.review.findMany({ where: { restaurantId } });
    res.status(200).json({ reviews });
  })
);

export default router;
