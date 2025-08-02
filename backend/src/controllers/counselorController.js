/**
 * counselorController.js
 * ----------------------
 * This file contains the logic for managing counselor profiles.
 */

const Counselor = require('../models/Counselor');

/**
 * @desc    Get all counselors
 * @route   GET /api/counselors
 * @access  Public
 */
exports.getCounselors = async (req, res) => {
    try {
        const counselors = await Counselor.find().sort({ name: 1 });
        res.status(200).json({ success: true, count: counselors.length, data: counselors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Create a new counselor
 * @route   POST /api/counselors
 * @access  Private (Admin)
 */
exports.createCounselor = async (req, res) => {
    // Add an additional check for admin role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'User is not authorized to perform this action' });
    }
    try {
        const counselor = await Counselor.create(req.body);
        res.status(201).json({ success: true, data: counselor });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error creating counselor', error: error.message });
    }
};

/**
 * @desc    Update a counselor
 * @route   PUT /api/counselors/:id
 * @access  Private (Admin)
 */
exports.updateCounselor = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'User is not authorized' });
    }
    try {
        let counselor = await Counselor.findById(req.params.id);
        if (!counselor) {
            return res.status(404).json({ success: false, message: 'Counselor not found' });
        }
        if (counselor.isDefault) {
            return res.status(400).json({ success: false, message: 'Default counselors cannot be modified.' });
        }
        counselor = await Counselor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: counselor });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error updating counselor', error: error.message });
    }
};

/**
 * @desc    Delete a counselor
 * @route   DELETE /api/counselors/:id
 * @access  Private (Admin)
 */
exports.deleteCounselor = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'User is not authorized' });
    }
    try {
        const counselor = await Counselor.findById(req.params.id);
        if (!counselor) {
            return res.status(404).json({ success: false, message: 'Counselor not found' });
        }
        if (counselor.isDefault) {
            return res.status(400).json({ success: false, message: 'Default counselors cannot be deleted.' });
        }
        await counselor.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
