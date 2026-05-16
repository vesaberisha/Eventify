import express from "express";
import * as bookingController from "../controllers/booking.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, bookingController.createBooking);
router.get("/my-bookings", authenticateToken, bookingController.getMyBookings);
router.get("/:id", authenticateToken, bookingController.getBookingById);

export default router;
