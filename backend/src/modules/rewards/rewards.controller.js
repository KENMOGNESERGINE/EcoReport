const rewardsService = require('./rewards.service');

const getUserPoints = async (req, res) => {
  try {
    const points = await rewardsService.getUserPoints(
      req.user.userId
    );
    res.status(200).json({
      success: true,
      data: points
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUserRewards = async (req, res) => {
  try {
    const rewards = await rewardsService.getUserRewards(
      req.user.userId
    );
    res.status(200).json({
      success: true,
      data: rewards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await rewardsService.getLeaderboard();
    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getUserPoints,
  getUserRewards,
  getLeaderboard,
};