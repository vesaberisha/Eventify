import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

function getStripe() {
  const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim().replace(/^["']|["']$/g, "");
  if (!stripeSecret?.startsWith("sk_")) {
    throw new Error(
      "STRIPE_SECRET_KEY duhet të jetë Secret Key (sk_test_...), jo Restricted Key (rk_...)"
    );
  }
  return new Stripe(stripeSecret);
}

export const createPaymentSession = async (bookingId, userId) => {
  const stripe = getStripe();
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { event: true },
  });

  if (!booking || booking.userId !== userId) {
    throw new Error("Booking not found or unauthorized");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: booking.event.title,
          },
          unit_amount: Math.round(booking.totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/payment/cancel`,
    metadata: {
      bookingId: booking.id,
      userId: userId,
    },
  });

  return { sessionId: session.id, url: session.url };
};
