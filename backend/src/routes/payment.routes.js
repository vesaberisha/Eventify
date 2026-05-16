import express from "express";
import * as paymentController from "../controllers/payment.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  authenticateToken,
  paymentController.createCheckoutSession
);

export default router;
