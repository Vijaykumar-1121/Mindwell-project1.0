/**
 * resourceController.js
 * ---------------------
 * This file contains the logic for handling all resource-related API requests.
 */

const Resource = require('../models/Resource');

/**
 * @desc    Get all resources
 * @route   GET /api/resources
 * @access  Public
 */
exports.getResources = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: resources.length, data: resources });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Create a new resource
 * @route   POST /api/resources
 * @access  Private (Admin)
 */
exports.createResource = async (req, res) => {
    // In a real app, an additional middleware would check if req.user.role is 'admin'
    try {
        const resource = await Resource.create(req.body);
        res.status(201).json({ success: true, data: resource });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error creating resource', error: error.message });
    }
};

/**
 * @desc    Update a resource
 * @route   PUT /api/resources/:id
 * @access  Private (Admin)
 */
exports.updateResource = async (req, res) => {
    try {
        let resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }
        resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: resource });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error updating resource', error: error.message });
    }
};

/**
 * @desc    Delete a resource
 * @route   DELETE /api/resources/:id
 * @access  Private (Admin)
 */
exports.deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }
        await resource.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
