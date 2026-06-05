const profileService = require('./association.profile.service');

const getFullProfile = async (req, res) => {
  try {
    const profile = await profileService.getFullProfile(
      req.user.userId
    );
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await profileService.updateProfile(
      req.user.userId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const addAchievement = async (req, res) => {
  try {
    const { title, description } = req.body;
    const achievement = await profileService.addAchievement(
      req.user.userId,
      title,
      description
    );
    res.status(201).json({
      success: true,
      message: 'Achievement added!',
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAchievements = async (req, res) => {
  try {
    const achievements = await profileService.getAchievements(
      req.user.userId
    );
    res.status(200).json({
      success: true,
      data: achievements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getFullProfile,
  updateProfile,
  addAchievement,
  getAchievements,
};