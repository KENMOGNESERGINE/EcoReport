const rewardsModel = require('./rewards.model');
const broker = require('../../events/broker');

const addPoints = async (userId, points, reason) => {
  const badge = rewardsModel.getBadge(points);
  const reward = await rewardsModel.addPoints(
    userId, points, reason, badge
  );

  await broker.publishEvent('reward.earned', {
    userId,
    points,
    reason,
    badge,
  });

  return reward;
};

const getUserPoints = async (userId) => {
  const result = await rewardsModel.getUserPoints(userId);
  const totalPoints = parseInt(result.total_points) || 0;
  return {
    totalPoints,
    badge: rewardsModel.getBadge(totalPoints),
    totalRewards: result.total_rewards,
  };
};

const getUserRewards = async (userId) => {
  return await rewardsModel.getUserRewards(userId);
};

const getLeaderboard = async () => {
  const users = await rewardsModel.getLeaderboard();
  return users.map(user => ({
    ...user,
    badge: rewardsModel.getBadge(
      parseInt(user.total_points) || 0
    ),
  }));
};

module.exports = {
  addPoints,
  getUserPoints,
  getUserRewards,
  getLeaderboard,
};