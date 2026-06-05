const profileService = require('./government.profile.service');

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

module.exports = {
  getFullProfile,
  updateProfile,
};