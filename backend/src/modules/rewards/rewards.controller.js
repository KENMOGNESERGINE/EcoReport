const rewardsService = require('./rewards.service');

const getUserPoints = async (req, res) => {
  try {
    const points = await rewardsService.getAvailablePoints(
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

const getRewardsCatalog = async (req, res) => {
  try {
    const catalog = rewardsService.getRewardsCatalog();
    res.status(200).json({
      success: true,
      data: catalog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const redeemReward = async (req, res) => {
  try {
    const { rewardType } = req.body;
    const redemption = await rewardsService.redeemReward(
      req.user.userId,
      rewardType
    );
    res.status(201).json({
      success: true,
      message: 'Reward redeemed successfully!',
      data: redemption
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getMyRedemptions = async (req, res) => {
  try {
    const redemptions = await rewardsService.getMyRedemptions(
      req.user.userId
    );
    res.status(200).json({
      success: true,
      data: redemptions
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
  getRewardsCatalog,
  redeemReward,
  getMyRedemptions,
};