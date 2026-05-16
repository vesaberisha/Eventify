import * as paymentService from "../services/payment.service.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const result = await paymentService.createPaymentSession(
      bookingId,
      req.user.id
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
