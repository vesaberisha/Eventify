import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllEvents = async (query = {}) => {
  const { category, date, minPrice, maxPrice } = query;

  let where = {};

  if (category) where.categories = { some: { category: { name: category } } };
  if (date) where.startDate = { gte: new Date(date) };
  if (minPrice) where.price = { gte: parseFloat(minPrice) };
  if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };

  return await prisma.event.findMany({
    where,
    include: {
      venue: true,
      images: true,
      categories: { include: { category: true } },
      organizer: { select: { firstName: true, lastName: true } },
    },
    orderBy: { startDate: "asc" },
  });
};

export const searchEvents = async (query) => {
  const { q } = query;
  return await prisma.event.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    include: { venue: true, categories: true },
  });
};

export const getEventById = async (id) => {
  return await prisma.event.findUnique({
    where: { id },
    include: {
      venue: true,
      images: true,
      categories: { include: { category: true } },
      ticketTypes: true,
      reviews: true,
      organizer: true,
    },
  });
};

export const createEvent = async (data, organizerId) => {
  return await prisma.event.create({
    data: {
      ...data,
      organizerId,
      venueId: data.venueId,
    },
  });
};

export const updateEvent = async (id, data, organizerId) => {
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) throw new Error("Event not found");
  if (existing.organizerId !== organizerId) {
    throw new Error("Only the organizer can update this event");
  }

  const { title, description, startDate, endDate, price, capacity, venueId } = data;
  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (startDate !== undefined) updateData.startDate = new Date(startDate);
  if (endDate !== undefined) updateData.endDate = new Date(endDate);
  if (price !== undefined) updateData.price = price;
  if (capacity !== undefined) updateData.capacity = capacity;
  if (venueId !== undefined) updateData.venueId = venueId;

  return await prisma.event.update({
    where: { id },
    data: updateData,
  });
};
