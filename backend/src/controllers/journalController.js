/**
 * journalController.js
 * --------------------
 * This file contains the logic for handling all journal-related API requests.
 * It includes functions for fetching all entries for a specific user,
 * creating a new entry, and (in the future) updating or deleting entries.
 * Every function here relies on the 'protect' middleware to ensure that
 * only the authenticated user can access their own entries.
 */

const JournalEntry = require('../models/JournalEntry');

// --- Controller Functions ---

/**
 * @desc    Get all journal entries for the logged-in user
 * @route   GET /api/journal
 * @access  Private
 */
exports.getJournalEntries = async (req, res, next) => {
    try {
        // The user's ID is available from the 'protect' middleware (req.user.id)
        const entries = await JournalEntry.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Create a new journal entry
 * @route   POST /api/journal
 * @access  Private
 */
exports.createJournalEntry = async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;

    const { title, content, user } = req.body;

    try {
        const entry = await JournalEntry.create({
            title,
            content,
            user,
        });

        res.status(201).json({
            success: true,
            data: entry,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error creating entry', error: error.message });
    }
};
