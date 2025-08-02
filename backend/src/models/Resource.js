/**
 * Resource.js
 * -----------
 * This file defines the data model for a single Resource.
 * Each resource has a title, type, topic, a link or embed code,
 * and a URL for a thumbnail image.
 */

const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    type: {
        type: String,
        required: [true, 'Please specify a type'],
        enum: ['article', 'video', 'music', 'meditation'],
    },
    topic: {
        type: String,
        required: [true, 'Please specify a topic'],
        enum: ['stress', 'anxiety', 'focus', 'sleep', 'breathe'],
    },
    link: { // Can be a URL or an embed code
        type: String,
        required: [true, 'Please provide a link or embed code'],
    },
    img: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Resource', ResourceSchema);
