const express = require('express');
const router = express.Router();
const campaignsController = require('./campaigns.controller');
const authMiddleware = require('../../middleware/auth');
const roleMiddleware = require('../../shared/role.middleware');

// PUBLIC routes
router.get('/', campaignsController.getAllCampaigns);
router.get('/:id', campaignsController.getCampaignById);

// CITIZEN routes
router.get(
  '/mine',
  authMiddleware,
  campaignsController.getMyCampaigns
);
router.post(
  '/:id/join',
  authMiddleware,
  campaignsController.joinCampaign
);
router.delete(
  '/:id/leave',
  authMiddleware,
  campaignsController.leaveCampaign
);

// ASSOCIATION only routes
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['association']),
  campaignsController.createCampaign
);

module.exports = router;