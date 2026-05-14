import * as eventService from "../services/event.service.js";

export const getAllEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEvents(req.query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchEvents = async (req, res) => {
  try {
    const events = await eventService.searchEvents(req.query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body, req.user.id);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body, req.user.id);
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
