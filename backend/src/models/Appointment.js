/**
 * Appointment.js
 * --------------
 * This file defines the data model for an Appointment. Each appointment
 * links a user (student) to a counselor, and includes the date, time,
 * and type of session (Online or In-Person).
 */

const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    counselor: {
        type: String, // In a larger app, this could be a reference to a Counselor model
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Online', 'Request Virtual', 'In-Person'],
        required: true,
    },
    reason: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Completed', 'Cancelled'],
        default: 'Upcoming',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
