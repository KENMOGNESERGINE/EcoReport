const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const authMiddleware = require('../../middleware/auth');
const roleMiddleware = require('../../shared/role.middleware');

// All admin routes protected
// Only admin role can access!
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get(
  '/stats',
  adminController.getAdminStats
);

router.get(
  '/users',
  adminController.getAllUsers
);

router.delete(
  '/users/:userId',
  adminController.deleteUser
);

router.patch(
  '/users/:userId/role',
  adminController.changeUserRole
);

router.delete(
  '/reports/:reportId',
  adminController.deleteReport
);

module.exports = router;