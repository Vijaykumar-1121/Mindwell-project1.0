/**
 * errorMiddleware.js
 * ------------------
 * This is a centralized error handling middleware for the Express application.
 * It catches errors that occur in any of the routes and formats them into a
 * consistent JSON response, preventing the server from crashing and avoiding
 * the leak of sensitive stack trace information to the client.
 */

const errorHandler = (err, req, res, next) => {
    // Log the full error to the console for the developer
    console.error(err.stack);

    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = { success: false, message: message };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { success: false, message: message };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { success: false, message: message };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
};

module.exports = errorHandler;
