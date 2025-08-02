/**
 * resources.js (routes)
 * ---------------------
 * This file defines the API routes for resource-related actions.
 * The route to get all resources is public, but the routes to create,
 * update, and delete resources are protected for admin use.
 */

const express = require('express');
const router = express.Router();

const {
    getResources,
    createResource,
    updateResource,
    deleteResource
} = require('../controllers/resourceController');

const { protect } = require('../middleware/authMiddleware');

// --- Route Definitions ---

// @route   GET /api/resources
// @desc    Get all resources
// @access  Public
router.get('/', getResources);

// @route   POST /api/resources
// @desc    Create a new resource
// @access  Private (Admin)
router.post('/', protect, createResource);

// @route   PUT /api/resources/:id
// @desc    Update a resource
// @access  Private (Admin)
router.put('/:id', protect, updateResource);

// @route   DELETE /api/resources/:id
// @desc    Delete a resource
// @access  Private (Admin)
router.delete('/:id', protect, deleteResource);

module.exports = router;
