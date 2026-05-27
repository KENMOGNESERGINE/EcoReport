const governmentService = require('./government.service');

const getAllReports = async (req, res) => {
  try {
    const reports = await governmentService.getAllReports();
    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getFullStats = async (req, res) => {
  try {
    const stats = await governmentService.getFullStats();
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

const getHotSpots = async (req, res) => {
  try {
    const hotspots = await governmentService.getHotSpots();
    res.status(200).json({
      success: true,
      data: hotspots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const assignToAgent = async (req, res) => {
  try {
    const { agentId, notes } = req.body;
    const assignment = await governmentService.assignToAgent(
      req.params.reportId,
      agentId,
      req.user.userId,
      notes
    );
    res.status(200).json({
      success: true,
      message: 'Report assigned successfully!',
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAgents = async (req, res) => {
  try {
    const agents = await governmentService.getAgents();
    res.status(200).json({
      success: true,
      data: agents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMonthlyStats = async (req, res) => {
  try {
    const stats = await governmentService.getMonthlyStats();
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
  getAllReports,
  getFullStats,
  getHotSpots,
  assignToAgent,
  getAgents,
  getMonthlyStats,
};