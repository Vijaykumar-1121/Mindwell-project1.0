/**
 * counselors.js (routes)
 * ----------------------
 * This file defines the API routes for counselor-related actions.
 */

const express = require('express');
const router = express.Router();

const {
    getCounselors,
    createCounselor,
    updateCounselor,
    deleteCounselor
} = require('../controllers/counselorController');

const { protect } = require('../middleware/authMiddleware');

// --- Route Definitions ---

router.route('/')
    .get(getCounselors) // Public route for anyone to see counselors
    .post(protect, createCounselor); // Protected route for admins

router.route('/:id')
    .put(protect, updateCounselor) // Protected route for admins
    .delete(protect, deleteCounselor); // Protected route for admins

module.exports = router;
