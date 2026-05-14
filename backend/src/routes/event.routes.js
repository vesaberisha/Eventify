import express from "express";
import * as eventController from "../controllers/event.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", eventController.getAllEvents);
router.get("/search", eventController.searchEvents);
router.get("/:id", eventController.getEventById);
router.post("/", authenticateToken, eventController.createEvent);
router.put("/:id", authenticateToken, eventController.updateEvent);

export default router;
