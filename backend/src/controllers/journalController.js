/**
 * journalController.js
 * --------------------
 * Handles all journal-related API logic.
 */

const JournalEntry = require('../models/JournalEntry');
const User = require('../models/User');

// @desc  Get all journal entries for the logged-in user (My Entries)
exports.getJournalEntries = async (req, res, next) => {
    try {
        const entries = await JournalEntry.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: entries.length, data: entries });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc  Get community feed — excludes own posts, shows public + followed-private
exports.getCommunityFeed = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.user.id);

        const entries = await JournalEntry.find({
            user: { $ne: currentUser._id }, // Exclude own posts
            $or: [
                { visibility: 'public' },
                { visibility: 'private', user: { $in: currentUser.following } }
            ]
        })
        .populate('user', 'name username')
        .populate('comments.user', 'name username')
        .sort({ createdAt: -1 });

        // Strip privateNotes — these are other people's private notes
        const sanitizedEntries = entries.map(entry => {
            const entryObj = entry.toObject();
            delete entryObj.privateNotes;
            return entryObj;
        });

        res.status(200).json({ success: true, count: sanitizedEntries.length, data: sanitizedEntries });
    } catch (error) {
        console.error("Feed error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc  Create a new journal entry
exports.createJournalEntry = async (req, res, next) => {
    const { title, content, visibility, privateNotes } = req.body;
    const user = req.user.id;

    try {
        const entry = await JournalEntry.create({
            title,
            content,
            user,
            visibility: visibility || 'private',
            privateNotes: privateNotes || ''
        });
        res.status(201).json({ success: true, data: entry });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error creating entry', error: error.message });
    }
};

// @desc  Toggle like on a journal entry
exports.likeJournalEntry = async (req, res, next) => {
    try {
        const entry = await JournalEntry.findById(req.params.id);
        if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });

        if (entry.likes.includes(req.user.id)) {
            entry.likes = entry.likes.filter(id => id.toString() !== req.user.id);
        } else {
            entry.likes.push(req.user.id);
        }

        await entry.save();
        res.status(200).json({ success: true, data: entry });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc  Add a comment to a journal entry
exports.commentJournalEntry = async (req, res, next) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ success: false, message: "Comment text is required" });

        const entry = await JournalEntry.findById(req.params.id);
        if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });

        entry.comments.push({ user: req.user.id, text });
        await entry.save();

        const populatedEntry = await JournalEntry.findById(req.params.id).populate('comments.user', 'name username');
        res.status(200).json({ success: true, data: populatedEntry });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc  Update a journal entry (owner only)
exports.updateJournalEntry = async (req, res, next) => {
    try {
        const entry = await JournalEntry.findById(req.params.id);
        if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
        if (entry.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

        const { title, content, visibility, privateNotes } = req.body;
        entry.title = title || entry.title;
        entry.content = content || entry.content;
        entry.visibility = visibility || entry.visibility;
        entry.privateNotes = privateNotes !== undefined ? privateNotes : entry.privateNotes;

        await entry.save();
        res.status(200).json({ success: true, data: entry });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc  Delete a journal entry (owner only)
exports.deleteJournalEntry = async (req, res, next) => {
    try {
        const entry = await JournalEntry.findById(req.params.id);
        if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
        if (entry.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });

        await entry.deleteOne();
        res.status(200).json({ success: true, message: 'Entry removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
