const asyncHandler = require("../utils/asyncHandler");
const ambulanceService = require("../services/ambulanceService");

const requestAmbulance = asyncHandler(async (req, res) => {
  const request = await ambulanceService.requestAmbulance(req.user.id, req.body);
  return res.status(201).json({ success: true, data: request });
});

const getAmbulanceById = asyncHandler(async (req, res) => {
  const ambulance = await ambulanceService.getAmbulanceById(req.params.id);
  if (!ambulance) {
    return res.status(404).json({ message: "Ambulance request not found" });
  }
  return res.json({ data: ambulance });
});

const getMyRequests = asyncHandler(async (req, res) => {
  const list = await ambulanceService.getRequestsForUser(req.user.id);
  return res.json({ data: list });
});

const getAllRequests = asyncHandler(async (req, res) => {
  const list = await ambulanceService.getAllRequests();
  return res.json({ data: list });
});

const getPendingRequests = asyncHandler(async (req, res) => {
  const list = await ambulanceService.getPendingRequests();
  return res.json({ data: list });
});

const approveRequest = asyncHandler(async (req, res) => {
  const request = await ambulanceService.updateStatus(req.params.id, "approved");
  return res.json({ data: request });
});

const rejectRequest = asyncHandler(async (req, res) => {
  const request = await ambulanceService.updateStatus(req.params.id, "rejected");
  return res.json({ data: request });
});

const completeRequest = asyncHandler(async (req, res) => {
  const request = await ambulanceService.updateStatus(req.params.id, "completed");
  return res.json({ data: request });
});

module.exports = {
  requestAmbulance,
  getAmbulanceById,
  getMyRequests,
  getAllRequests,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  completeRequest
};
