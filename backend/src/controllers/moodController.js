/**
 * moodController.js
 * -----------------
 * This file contains the logic for handling mood-related API requests.
 * It includes functions for fetching all mood entries for a user and for
 * creating or updating a mood entry for the current day, preventing duplicate
 * entries for the same day.
 */

const MoodEntry = require('../models/MoodEntry');

// --- Controller Functions ---

/**
 * @desc    Get all mood entries for the logged-in user
 * @route   GET /api/mood
 * @access  Private
 */
exports.getMoodEntries = async (req, res, next) => {
    try {
        // Find all entries belonging to the currently logged-in user
        const entries = await MoodEntry.find({ user: req.user.id }).sort({ entryDate: -1 });

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
 * @desc    Log a new mood entry for the current day (or update if one exists)
 * @route   POST /api/mood
 * @access  Private
 */
exports.logMoodEntry = async (req, res, next) => {
    const { mood, notes, tags } = req.body;
    
    // Set the entry date to the start of the current day to ensure one entry per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        // Check if an entry for today already exists for this user
        let entry = await MoodEntry.findOne({ user: req.user.id, entryDate: today });

        if (entry) {
            // If an entry exists, update it
            entry.mood = mood;
            entry.notes = notes;
            entry.tags = tags;
            await entry.save();
            res.status(200).json({ success: true, data: entry });
        } else {
            // If no entry exists, create a new one
            entry = await MoodEntry.create({
                user: req.user.id,
                mood,
                notes,
                tags,
                entryDate: today,
            });
            res.status(201).json({ success: true, data: entry });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error logging mood', error: error.message });
    }
};
