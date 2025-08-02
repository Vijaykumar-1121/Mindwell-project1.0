const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    mood: { type: Number, required: true, min: 1, max: 5 },
    notes: { type: String, trim: true },
    tags: { type: [String] },
    entryDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MoodEntry', MoodEntrySchema);
