const express = require('express');
const router = express.Router();
const rewardsController = require('./rewards.controller');
const authMiddleware = require('../../middleware/auth');

// All rewards routes need authentication
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
  '/leaderboard',
  rewardsController.getLeaderboard
);

module.exports = router;