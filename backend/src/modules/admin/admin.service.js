const adminModel = require('./admin.model');
const broker = require('../../events/broker');

const getAllUsers = async () => {
  return await adminModel.getAllUsers();
};

const deleteUser = async (userId) => {
  const user = await adminModel.deleteUser(userId);

  await broker.publishEvent('user.deleted', {
    userId,
    deletedAt: new Date(),
  });

  return user;
};

const changeUserRole = async (userId, role) => {
  const user = await adminModel.changeUserRole(userId, role);

  await broker.publishEvent('user.role_changed', {
    userId,
    newRole: role,
  });

  return user;
};

const deleteReport = async (reportId) => {
  const report = await adminModel.deleteReport(reportId);

  await broker.publishEvent('report.deleted', {
    reportId,
    deletedAt: new Date(),
  });

  return report;
};

const getAdminStats = async () => {
  return await adminModel.getAdminStats();
};

module.exports = {
  getAllUsers,
  deleteUser,
  changeUserRole,
  deleteReport,
  getAdminStats,
};