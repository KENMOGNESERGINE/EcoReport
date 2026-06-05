const express = require('express');
const router = express.Router();
const rewardsController = require('./rewards.controller');
const authMiddleware = require('../../middleware/auth');

// Public routes
router.get(
  '/leaderboard',
  rewardsController.getLeaderboard
);

router.get(
  '/catalog',
  rewardsController.getRewardsCatalog
);

// Protected routes
router.get(
  '/my-points',
  authMiddleware,
  rewardsController.getUserPoints
);

router.get(
  '/my-rewards',
  authMiddleware,
  rewardsController.getUserRewards
);

router.get(
  '/my-redemptions',
  authMiddleware,
  rewardsController.getMyRedemptions
);

router.post(
  '/redeem',
  authMiddleware,
  rewardsController.redeemReward
);

module.exports = router;