/**
 * auth.js (routes)
 * ----------------
 * This file defines the API routes for authentication-related actions,
 * such as user registration and login. It maps the HTTP endpoints
 * to the corresponding controller functions that contain the logic.
 */

const express = require('express');
const router = express.Router();

// Import the controller functions
const { register, login } = require('../controllers/authController');

// --- Route Definitions ---

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Authenticate a user and get a token
// @access  Public
router.post('/login', login);


module.exports = router;
