/**
 * users.js (routes)
 * -----------------
 * This file defines the API routes for managing users.
 */

const express = require('express');
const router = express.Router();

const { updateProfile, getProfile, followUser, unfollowUser, discoverUsers, changePassword, deleteAccount, getNetwork, removeFollower } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// --- Route Definitions ---

router.route('/profile').get(protect, getProfile);
router.route('/profile').put(protect, updateProfile);
router.route('/password').put(protect, changePassword);
router.route('/account').delete(protect, deleteAccount);
router.route('/discover').get(protect, discoverUsers);
router.route('/network').get(protect, getNetwork);
router.route('/follow/:id').post(protect, followUser);
router.route('/unfollow/:id').post(protect, unfollowUser);
router.route('/remove-follower/:id').post(protect, removeFollower);

module.exports = router;
