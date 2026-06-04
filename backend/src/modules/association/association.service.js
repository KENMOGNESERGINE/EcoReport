const associationModel = require('./association.model');
const broker = require('../../events/broker');

const getAreaReports = async (associationId) => {
  return await associationModel.getAreaReports(associationId);
};

const updateReportStatus = async (
  reportId, status, associationId
) => {
  const report = await associationModel.updateReportStatus(
    reportId, status, associationId
  );

  await broker.publishEvent('report.status_changed', {
    reportId,
    status,
    updatedBy: associationId,
    userType: 'association',
  });

  return report;
};

const getAssociationStats = async (associationId) => {
  return await associationModel.getAssociationStats(
    associationId
  );
};

const getAssociationCampaigns = async (associationId) => {
  return await associationModel.getAssociationCampaigns(
    associationId
  );
};

module.exports = {
  getAreaReports,
  updateReportStatus,
  getAssociationStats,
  getAssociationCampaigns,
};