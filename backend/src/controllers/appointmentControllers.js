/**
 * appointmentController.js
 * ------------------------
 * This file contains the logic for handling appointment-related API requests.
 */

const Appointment = require('../models/Appointment');

/**
 * @desc    Get all appointments for the logged-in user
 * @route   GET /api/appointments
 * @access  Private
 */
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Create a new appointment
 * @route   POST /api/appointments
 * @access  Private
 */
exports.createAppointment = async (req, res) => {
    try {
        // Add the logged-in user's ID to the request body
        req.body.user = req.user.id;
        
        const appointment = await Appointment.create(req.body);
        res.status(201).json({ success: true, data: appointment });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error creating appointment', error: error.message });
    }
};

/**
 * @desc    Delete an appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private
 */
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Make sure user owns appointment
        if (appointment.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this appointment' });
        }

        await appointment.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
