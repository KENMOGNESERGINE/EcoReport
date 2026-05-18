const reportingModel = require('./reporting.model');
const broker = require('../../events/broker');

const createReport = async (
  title,
  description,
  userId,
  latitude,
  longitude,
  photoUrl,
  wasteType
) => {
  const report = await reportingModel.createReport(
    title,
    description,
    userId,
    latitude,
    longitude,
    photoUrl,
    wasteType
  );

  await broker.publishEvent('report.submitted', {
    reportId: report.id,
    userId: report.user_id,
    latitude: report.latitude,
    longitude: report.longitude,
    wasteType: report.waste_type,
    photoUrl: report.photo_url,
  });

  return report;
};

const getAllReports = async () => {
  return await reportingModel.getAllReports();
};

const getReportById = async (id) => {
  return await reportingModel.getReportById(id);
};

const getMyReports = async (userId) => {
  return await reportingModel.getMyReports(userId);
};

const updateReport = async (
  id,
  title,
  description,
  wasteType
) => {
  return await reportingModel.updateReport(
    id,
    title,
    description,
    wasteType
  );
};

const updateReportStatus = async (id, status, assignedTo) => {
  return await reportingModel.updateReportStatus(
    id,
    status,
    assignedTo
  );
};

const getNearbyReports = async (latitude, longitude) => {
  return await reportingModel.getNearbyReports(
    latitude,
    longitude
  );
};

const getReportStats = async () => {
  return await reportingModel.getReportStats();
};

const deleteReport = async (id, userId) => {
  return await reportingModel.deleteReport(id, userId);
};

const addComment = async (reportId, userId, content) => {
  return await reportingModel.addComment(
    reportId,
    userId,
    content
  );
};

const getComments = async (reportId) => {
  return await reportingModel.getComments(reportId);
};

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  getMyReports,
  updateReport,
  updateReportStatus,
  getNearbyReports,
  getReportStats,
  deleteReport,
  addComment,
getComments,
};