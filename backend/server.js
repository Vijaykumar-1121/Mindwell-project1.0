/**
 * server.js
 * ---------
 * This is the main entry point for the MindWell backend application.
 * It sets up the Express server, connects to the database,
 * and configures the necessary middleware and API routes.
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', require('./src/api/auth'));
app.use('/api/journal', require('./src/api/journal'));
app.use('/api/mood', require('./src/api/mood'));
app.use('/api/resources', require('./src/api/resources'));
app.use('/api/appointments', require('./src/api/appointments'));
app.use('/api/users', require('./src/api/users'));
app.use('/api/counselors', require('./src/api/counselors'));


const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
