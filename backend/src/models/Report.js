/**
 * Report.js
 * ---------
 * This file defines the data model for a single Problem Report.
 * It includes the user who submitted it, the problem category, a description,
 * and steps to reproduce the issue.
 */

const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['login-issue', 'dashboard-bug', 'chat-problem', 'page-loading', 'other'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description of the problem'],
    },
    stepsToReproduce: {
        type: String,
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

module.exports = mongoose.model('Report', ReportSchema);
