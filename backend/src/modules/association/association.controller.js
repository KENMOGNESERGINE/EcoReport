const associationService = require('./association.service');

const getAreaReports = async (req, res) => {
  try {
    const reports = await associationService.getAreaReports(
      req.user.userId
    );
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

const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await associationService.updateReportStatus(
      req.params.reportId,
      status,
      req.user.userId
    );
    res.status(200).json({
      success: true,
      message: 'Status updated successfully!',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAssociationStats = async (req, res) => {
  try {
    const stats = await associationService.getAssociationStats(
      req.user.userId
    );
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

const getAssociationCampaigns = async (req, res) => {
  try {
    const campaigns = await associationService.getAssociationCampaigns(
      req.user.userId
    );
    res.status(200).json({
      success: true,
      data: campaigns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAreaReports,
  updateReportStatus,
  getAssociationStats,
  getAssociationCampaigns,
};