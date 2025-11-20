const { Ambulance, Notification, User } = require("../models");

// Ambulance pricing constants
const AMBULANCE_PRICES = {
  basic: 50,
  advanced: 100,
  emergency: 150
};

const calculateAmbulancePrice = (ambulanceType, distance) => {
  const pricePerKm = AMBULANCE_PRICES[ambulanceType] || 50;
  const dist = distance || 10; // Default 10km if not provided
  const totalAmount = pricePerKm * dist;
  return { pricePerKm, distance: dist, totalAmount };
};

const requestAmbulance = async (userId, payload) => {
  const pricing = calculateAmbulancePrice(
    payload.ambulanceType || "basic",
    payload.distance
  );

  const request = await Ambulance.create({
    userId,
    fullName: payload.fullName,
    contact: payload.contact,
    pickupLocation: payload.pickupLocation,
    dropLocation: payload.dropLocation,
    reason: payload.reason || null,
    ambulanceType: payload.ambulanceType || "basic",
    distance: pricing.distance,
    pricePerKm: pricing.pricePerKm,
    totalAmount: pricing.totalAmount
  });

  await Notification.create({
    userId,
    title: "Ambulance requested",
    message: "Your ambulance request is pending approval.",
    type: "booking"
  });

  return request;
};

const getAmbulanceById = async (id) => {
  const ambulance = await Ambulance.findByPk(id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }]
  });
  if (!ambulance) {
    const error = new Error("Ambulance request not found");
    error.status = 404;
    throw error;
  }
  return ambulance;
};

const getRequestsForUser = async (userId) => {
  return Ambulance.findAll({
    where: { userId },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
    order: [["createdAt", "DESC"]]
  });
};

const getAllRequests = async () => {
  return Ambulance.findAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
    order: [["createdAt", "DESC"]]
  });
};

const getPendingRequests = async () => {
  return Ambulance.findAll({
    where: { status: "pending" },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
    order: [["createdAt", "DESC"]]
  });
};

const updateStatus = async (id, status) => {
  const request = await Ambulance.findByPk(id);
  if (!request) {
    const error = new Error("Ambulance request not found");
    error.status = 404;
    throw error;
  }

  request.status = status;
  await request.save();

  await Notification.create({
    userId: request.userId,
    title: "Ambulance update",
    message: `Your ambulance request status is now ${status}.`,
    type: "booking"
  });

  return request;
};

module.exports = {
  requestAmbulance,
  getAmbulanceById,
  getRequestsForUser,
  getAllRequests,
  getPendingRequests,
  updateStatus
};
