/**
 * Contact.js
 * ----------
 * This file defines the data model for a single Contact Form submission.
 * It captures the user's name, email, and message.
 */

const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address',
        ],
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
    },
    status: {
        type: String,
        enum: ['new', 'responded'],
        default: 'new',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Contact', ContactSchema);
