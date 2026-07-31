/**
 * journal.js (routes)
 * -------------------
 * This file defines the API routes for journal-related actions.
 * All routes in this file are protected, meaning a user must be logged in
/**
 * journal.js (routes)
 * -------------------
 * This file defines the API routes for journal-related actions.
 * All routes in this file are protected, meaning a user must be logged in
 * to access them.
 */

const express = require('express');
const router = express.Router();

const {
    getJournalEntries,
    createJournalEntry,
    getCommunityFeed,
    likeJournalEntry,
    commentJournalEntry,
    updateJournalEntry,
    deleteJournalEntry
} = require('../controllers/journalController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// @route   GET /api/journal/feed
// @desc    Get community feed (public + followed private)
router.get('/feed', getCommunityFeed);

// @route   GET /api/journal
// @desc    Get all journal entries for the logged-in user
router.get('/', getJournalEntries);

// @route   POST /api/journal
// @desc    Create a new journal entry
router.post('/', createJournalEntry);

// @route   POST /api/journal/:id/like
// @desc    Toggle like on a journal entry
router.post('/:id/like', likeJournalEntry);

// @route   POST /api/journal/:id/comment
// @desc    Add a comment to a journal entry
router.post('/:id/comment', commentJournalEntry);

// @route   PUT /api/journal/:id
router.put('/:id', updateJournalEntry);

// @route   DELETE /api/journal/:id
router.delete('/:id', deleteJournalEntry);

module.exports = router;
