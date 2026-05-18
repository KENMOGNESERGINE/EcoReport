const reportingService = require('./reporting.service');
const uploadImage = require('../../shared/cloudinary');
const {
  validateReport,
  validateComment,
} = require('../../shared/validation');

const createReport = async (req, res) => {
  try {
    const { title, description, latitude, longitude, wasteType, photoUrl } = req.body;
    const userId = req.user.userId;
    const report = await reportingService.createReport(
      title, description, userId,
      latitude, longitude, photoUrl, wasteType
    );
    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createReportWithPhoto = async (req, res) => {
  try {
    const errors = validateReport(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const {
      title,
      description,
      category,
      latitude,
      longitude,
      waste_type,
    } = req.body;

    const userId = req.user.userId;
    let photoUrl = null;

    if (req.file) {
      photoUrl = await uploadImage.uploadImage(req.file.path);
    }

    const report = await reportingService.createReport(
      title,
      description,
      category,
      userId,
      parseFloat(latitude),
      parseFloat(longitude),
      photoUrl,
      waste_type
    );

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: report,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await reportingService.getAllReports();
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await reportingService.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await reportingService.getMyReports(req.user.userId);
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateReport = async (req, res) => {
  try {
    const { title, description, wasteType } = req.body;
    const report = await reportingService.updateReport(
      req.params.id, title, description, wasteType
    );
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const report = await reportingService.updateReportStatus(
      req.params.id, status, assignedTo
    );
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNearbyReports = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const reports = await reportingService.getNearbyReports(latitude, longitude);
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReportStats = async (req, res) => {
  try {
    const stats = await reportingService.getReportStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    const report = await reportingService.deleteReport(
      req.params.id,
      req.user.userId
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or not yours',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const errors = validateComment(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const comment = await reportingService.addComment(
      req.params.id,
      req.user.userId,
      req.body.content
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await reportingService.getComments(
      req.params.id
    );
    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReport,
  createReportWithPhoto,
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