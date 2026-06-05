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
const REWARDS_CATALOG = [
  {
    id: 1,
    type: 'certificate',
    title: '🎖️ Eco Certificate',
    description: 'Official Eco Citizen Certificate of Yaoundé',
    pointsCost: 100,
    icon: '🎖️',
  },
  {
    id: 2,
    type: 'airtime',
    title: '📱 Airtime Voucher',
    description: '500 FCFA MTN airtime credit',
    pointsCost: 200,
    icon: '📱',
  },
  {
    id: 3,
    type: 'voucher',
    title: '🛒 Market Voucher',
    description: '10% discount at partner shops',
    pointsCost: 300,
    icon: '🛒',
  },
  {
    id: 4,
    type: 'champion',
    title: '🏆 Champion Badge',
    description: 'Exclusive Champion badge on your profile',
    pointsCost: 500,
    icon: '🏆',
  },
];

const getRewardsCatalog = () => {
  return REWARDS_CATALOG;
};

const redeemReward = async (userId, rewardType) => {
  const reward = REWARDS_CATALOG.find(r => r.type === rewardType);
  if (!reward) throw new Error('Reward not found!');

  const userPoints = await getUserPoints(userId);
  const spentPoints = await rewardsModel.getTotalSpentPoints(userId);
  const availablePoints = userPoints.totalPoints - spentPoints;

  if (availablePoints < reward.pointsCost) {
    throw new Error(
      `Not enough points! Need ${reward.pointsCost} pts, you have ${availablePoints} pts`
    );
  }

  const redemption = await rewardsModel.createRedemption(
    userId,
    rewardType,
    reward.pointsCost
  );

  await broker.publishEvent('reward.redeemed', {
    userId,
    rewardType,
    pointsSpent: reward.pointsCost,
    code: redemption.code,
  });

  return {
    ...redemption,
    reward,
  };
};

const getMyRedemptions = async (userId) => {
  return await rewardsModel.getMyRedemptions(userId);
};

const getAvailablePoints = async (userId) => {
  const userPoints = await getUserPoints(userId);
  const spentPoints = await rewardsModel.getTotalSpentPoints(userId);
  return {
    totalPoints: userPoints.totalPoints,
    spentPoints,
    availablePoints: userPoints.totalPoints - spentPoints,
    badge: userPoints.badge,
  };
};

module.exports = {
  addPoints,
  getUserPoints,
  getUserRewards,
  getLeaderboard,
  getRewardsCatalog,
  redeemReward,
  getMyRedemptions,
  getAvailablePoints,
};