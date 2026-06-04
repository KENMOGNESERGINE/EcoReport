const governmentModel = require('./government.model');
const broker = require('../../events/broker');

const getAllReports = async () => {
  return await governmentModel.getAllReports();
};

const getFullStats = async () => {
  return await governmentModel.getFullStats();
};

const getHotSpots = async () => {
  return await governmentModel.getHotSpots();
};

const assignToAgent = async (
  reportId, agentId, assignedBy, notes
) => {
  const assignment = await governmentModel.assignToAgent(
    reportId, agentId, assignedBy, notes
  );

  await broker.publishEvent('report.assigned', {
    reportId,
    agentId,
    assignedBy,
    notes,
  });

  return assignment;
};

const getAgents = async () => {
  return await governmentModel.getAgents();
};

const getMonthlyStats = async () => {
  return await governmentModel.getMonthlyStats();
};

module.exports = {
  getAllReports,
  getFullStats,
  getHotSpots,
  assignToAgent,
  getAgents,
  getMonthlyStats,
};