const campaignsService = require('./campaigns.service');

const createCampaign = async (req, res) => {
  try {
    const {
      title, description,
      location, date, maxParticipants
    } = req.body;
    const associationId = req.user.userId;

    const campaign = await campaignsService.createCampaign(
      title, description, associationId,
      location, date, maxParticipants
    );

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignsService.getAllCampaigns();
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

const getCampaignById = async (req, res) => {
  try {
    const campaign = await campaignsService.getCampaignById(
      req.params.id
    );
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const joinCampaign = async (req, res) => {
  try {
    const result = await campaignsService.joinCampaign(
      req.params.id,
      req.user.userId
    );
    res.status(200).json({
      success: true,
      message: 'Joined campaign successfully!',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const leaveCampaign = async (req, res) => {
  try {
    const result = await campaignsService.leaveCampaign(
      req.params.id,
      req.user.userId
    );
    res.status(200).json({
      success: true,
      message: 'Left campaign successfully!',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignsService.getMyCampaigns(
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
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  joinCampaign,
  leaveCampaign,
  getMyCampaigns,
};