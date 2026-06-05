const profileModel = require('./government.profile.model');

const getFullProfile = async (governmentId) => {
  return await profileModel.getFullProfile(governmentId);
};

const updateProfile = async (governmentId, profileData) => {
  return await profileModel.updateProfile(
    governmentId,
    profileData
  );
};

module.exports = {
  getFullProfile,
  updateProfile,
};