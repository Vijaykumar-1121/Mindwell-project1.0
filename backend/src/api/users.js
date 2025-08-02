/**
 * users.js (routes)
 * -----------------
 * This file defines the API routes for managing users.
 * All routes are protected and intended for admin use only.
 */

const express = require('express');
const router = express.Router();

const { getUsers, suspendUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// @route   GET /api/users
// @desc    Get all student users
// @access  Private (Admin)
router.route('/').get(protect, getUsers);

// @route   PUT /api/users/:id/suspend
// @desc    Suspend a user account
// @access  Private (Admin)
router.route('/:id/suspend').put(protect, suspendUser);

module.exports = router;
