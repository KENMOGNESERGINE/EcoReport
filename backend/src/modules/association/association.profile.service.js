const profileModel = require('./association.profile.model');

const getFullProfile = async (associationId) => {
  return await profileModel.getFullProfile(associationId);
};

const updateProfile = async (associationId, profileData) => {
  return await profileModel.updateProfile(
    associationId, profileData
  );
};

const addAchievement = async (
  associationId, title, description
) => {
  return await profileModel.addAchievement(
    associationId, title, description
  );
};

const getAchievements = async (associationId) => {
  return await profileModel.getAchievements(associationId);
};

module.exports = {
  getFullProfile,
  updateProfile,
  addAchievement,
  getAchievements,
};