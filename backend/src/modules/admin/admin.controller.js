const adminService = require('./admin.service');

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await adminService.deleteUser(
      req.params.userId
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await adminService.changeUserRole(
      req.params.userId,
      role
    );
    res.status(200).json({
      success: true,
      message: 'Role updated successfully!',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteReport = async (req, res) => {
  try {
    const report = await adminService.deleteReport(
      req.params.reportId
    );
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Report deleted successfully!',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const stats = await adminService.getAdminStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  changeUserRole,
  deleteReport,
  getAdminStats,
};