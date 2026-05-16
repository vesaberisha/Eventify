import * as paymentService from "../services/payment.service.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "bookingId mungon në kërkesë" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Sesioni i pavlefshëm. Kyçuni përsëri." });
    }

    const result = await paymentService.createPaymentSession(
      bookingId,
      req.user.id
    );
    res.json(result);
  } catch (error) {
    console.error("[payment] create-checkout-session:", error.message);
    const status = error.message?.includes("unauthorized") ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
};
