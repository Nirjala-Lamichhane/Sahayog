const asyncHandler = require("../utils/asyncHandler");
const reportService = require("../services/reportService");

const createReport = asyncHandler(async (req, res) => {
  const required = [
    "userId",
    "patientName",
    "department",
    "testType",
    "result",
    "doctorName",
    "findings",
    "visitDate",
    "testDate"
  ];
  const missing = required.filter((key) => !req.body[key]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
  }

  const payload = {
    userId: req.body.userId,
    patientName: req.body.patientName,
    department: req.body.department,
    testType: req.body.testType,
    result: req.body.result,
    doctorName: req.body.doctorName,
    findings: req.body.findings,
    prescription: req.body.prescription,
    notes: req.body.notes,
    visitDate: req.body.visitDate,
    testDate: req.body.testDate,
    appointmentId: req.body.appointmentId || null,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null
  };

  const report = await reportService.createReport(payload);
  return res.status(201).json({ data: report });
});

const updateReport = asyncHandler(async (req, res) => {
  const updates = {
    patientName: req.body.patientName,
    department: req.body.department,
    testType: req.body.testType,
    result: req.body.result,
    doctorName: req.body.doctorName,
    findings: req.body.findings,
    prescription: req.body.prescription,
    notes: req.body.notes,
    visitDate: req.body.visitDate,
    testDate: req.body.testDate,
    appointmentId: req.body.appointmentId || null
  };

  if (req.file) {
    updates.imageUrl = `/uploads/${req.file.filename}`;
  }

  const report = await reportService.updateReport(req.params.id, updates);
  return res.json({ data: report });
});

const deleteReport = asyncHandler(async (req, res) => {
  const result = await reportService.deleteReport(req.params.id);
  return res.json(result);
});

const getMyReports = asyncHandler(async (req, res) => {
  const list = await reportService.getReportsForUser(req.user.id);
  return res.json({ data: list });
});

const getAllReports = asyncHandler(async (req, res) => {
  const list = await reportService.getAllReports();
  return res.json({ data: list });
});

module.exports = {
  createReport,
  updateReport,
  deleteReport,
  getMyReports,
  getAllReports
};
