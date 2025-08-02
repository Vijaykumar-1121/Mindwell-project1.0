/**
 * mood.js (routes)
 * ----------------
 * This file defines the API routes for mood-related actions.
 * All routes are protected to ensure users can only access their own data.
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const { getMoodEntries, logMoodEntry } = require('../controllers/moodController');

// Import the authentication middleware
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

// @route   GET /api/mood
// @desc    Get all mood entries for the logged-in user
router.get('/', getMoodEntries);

// @route   POST /api/mood
// @desc    Log a new mood entry for the current day
router.post('/', logMoodEntry);

module.exports = router;
