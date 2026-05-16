import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBooking = async (data, userId) => {
  const { eventId, ticketTypeId, quantity } = data;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { ticketTypes: true },
  });

  if (!event) throw new Error("Event not found");

  const ticketType = event.ticketTypes.find((t) => t.id === ticketTypeId);
  if (!ticketType) throw new Error("Ticket type not found");

  const totalAmount = ticketType.price * quantity;

  const booking = await prisma.booking.create({
    data: {
      userId,
      eventId,
      totalAmount,
      status: "pending",
    },
  });

  for (let i = 0; i < quantity; i++) {
    await prisma.ticket.create({
      data: {
        ticketTypeId,
        bookingId: booking.id,
        qrCode: `QR-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      },
    });
  }

  return booking;
};

export const getMyBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      event: { include: { venue: true } },
      tickets: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getBookingById = async (id, userId) => {
  const booking = await prisma.booking.findFirst({
    where: { id, userId },
    include: {
      event: { include: { venue: true } },
      tickets: { include: { ticketType: true } },
    },
  });

  if (!booking) throw new Error("Booking not found");
  return booking;
};
