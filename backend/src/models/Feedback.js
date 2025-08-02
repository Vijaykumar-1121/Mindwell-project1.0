/**
 * Feedback.js
 * -----------
 * This file defines the data model for a single Feedback submission.
 * It includes the user who submitted it (if they were logged in),
 * the category of feedback, the subject, and the message content.
 */

const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false, // Feedback can be from non-logged-in users
    },
    category: {
        type: String,
        required: true,
        enum: ['suggestion', 'technical-issue', 'general-feedback'],
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
    },
    status: {
        type: String,
        enum: ['new', 'in-progress', 'resolved'],
        default: 'new',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
