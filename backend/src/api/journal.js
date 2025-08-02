/**
 * journal.js (routes)
 * -------------------
 * This file defines the API routes for journal-related actions.
 * All routes in this file are protected, meaning a user must be logged in
 * to access them.
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    getJournalEntries,
    createJournalEntry,
} = require('../controllers/journalController');

// Import the authentication middleware
const { protect } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

// @route   GET /api/journal
// @desc    Get all journal entries for the logged-in user
router.get('/', getJournalEntries);

// @route   POST /api/journal
// @desc    Create a new journal entry
router.post('/', createJournalEntry);

module.exports = router;
