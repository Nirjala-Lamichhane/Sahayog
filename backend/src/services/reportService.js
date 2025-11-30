const { Report, Notification } = require("../models");

const createReport = async (payload) => {
  const report = await Report.create(payload);
  await Notification.create({
    userId: report.userId,
    title: "New report available",
    message: "A medical report has been added to your account.",
    type: "report"
  });
  return report;
};

const updateReport = async (id, updates) => {
  const report = await Report.findByPk(id);
  if (!report) {
    const error = new Error("Report not found");
    error.status = 404;
    throw error;
  }

  await report.update(updates);
  return report;
};

const deleteReport = async (id) => {
  const report = await Report.findByPk(id);
  if (!report) {
    const error = new Error("Report not found");
    error.status = 404;
    throw error;
  }

  await report.destroy();
  return { message: "Report deleted" };
};

const getReportsForUser = async (userId) => {
  return Report.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
};

const getAllReports = async () => {
  return Report.findAll({ order: [["createdAt", "DESC"]] });
};

module.exports = {
  createReport,
  updateReport,
  deleteReport,
  getReportsForUser,
  getAllReports
};
