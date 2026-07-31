const express = require('express');
const router = express.Router();

const {
    getUsers,
    suspendUser,
    getDashboardStats,
    getAnalyticsData
} = require('../controllers/adminController');

const { protect, adminProtect } = require('../middleware/authMiddleware');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', protect, adminProtect, getUsers);

// @route   PUT /api/admin/users/:id/suspend
// @desc    Suspend user
// @access  Private (Admin)
router.put('/users/:id/suspend', protect, adminProtect, suspendUser);

// @route   GET /api/admin/stats
// @desc    Get dashboard summary stats
// @access  Private (Admin)
router.get('/stats', protect, adminProtect, getDashboardStats);

// @route   GET /api/admin/analytics
// @desc    Get extended analytics data for charts
// @access  Private (Admin)
router.get('/analytics', protect, adminProtect, getAnalyticsData);

module.exports = router;
