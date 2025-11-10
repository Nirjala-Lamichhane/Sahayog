const asyncHandler = require("../utils/asyncHandler");
const transactionService = require("../services/transactionService");

const CABIN_PRICES = {
  "General Ward": 500,
  "Semi-Private": 1000,
  "Private": 2000,
  "ICU": 5000,
  "Deluxe": 3000
};

const AMBULANCE_PRICES = {
  basic: 50,
  advanced: 100,
  emergency: 150
};

const validatePaymentAmount = asyncHandler(async (req, res) => {
  const { type, distance, cabinType, checkInDate, checkOutDate, ambulanceType } = req.body;
  
  if (type === "ambulance") {
    const pricePerKm = AMBULANCE_PRICES[ambulanceType || "basic"] || 50;
    const km = parseInt(distance || 10, 10);
    const totalAmount = km * pricePerKm;
    return res.json({ amount: totalAmount, pricePerKm, distance: km });
  }
  
  if (type === "cabin") {
    const pricePerDay = CABIN_PRICES[cabinType] || 1000;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;
    const totalAmount = pricePerDay * numberOfDays;
    return res.json({ amount: totalAmount, pricePerDay, numberOfDays });
  }
  
  return res.json({ amount: 0 });
});

const processCabinPayment = asyncHandler(async (req, res) => {
  const { cabinBookingId, amount, paymentMethod } = req.body;
  const transaction = await transactionService.createTransaction(req.user.id, {
    bookingType: "cabin",
    bookingId: cabinBookingId,
    amount,
    paymentMethod,
    metadata: { cabinBookingId }
  });
  return res.json({ success: true, data: transaction });
});

const processAmbulancePayment = asyncHandler(async (req, res) => {
  const { ambulanceRequestId, amount, paymentMethod, distance } = req.body;
  const transaction = await transactionService.createTransaction(req.user.id, {
    bookingType: "ambulance",
    bookingId: ambulanceRequestId,
    amount,
    paymentMethod,
    metadata: { distance }
  });
  return res.json({ success: true, data: transaction });
});

const processAppointmentPayment = asyncHandler(async (req, res) => {
  const { appointmentId, amount, paymentMethod, service } = req.body;
  const transaction = await transactionService.createTransaction(req.user.id, {
    bookingType: "appointment",
    bookingId: appointmentId,
    amount,
    paymentMethod,
    metadata: { service }
  });
  return res.json({ success: true, data: transaction });
});

const getPaymentHistory = asyncHandler(async (req, res) => {
  const list = await transactionService.getTransactionsForUser(req.user.id);
  return res.json({ data: list });
});

module.exports = {
  validatePaymentAmount,
  processCabinPayment,
  processAmbulancePayment,
  processAppointmentPayment,
  getPaymentHistory
};
