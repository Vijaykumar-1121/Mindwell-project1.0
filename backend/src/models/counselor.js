/**
 * Counselor.js
 * ------------
 * This file defines the data model for a Counselor.
 * It includes their name, specialty, a short bio, and a flag
 * to protect the default counselors from being deleted.
 */

const mongoose = require('mongoose');

const CounselorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    specialty: {
        type: String,
        required: [true, 'Please provide a specialty'],
        trim: true,
    },
    bio: {
        type: String,
        required: [true, 'Please provide a bio'],
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Counselor', CounselorSchema);
