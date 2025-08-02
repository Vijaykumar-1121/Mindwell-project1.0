/**
 * db.js
 * -----
 * This file handles the connection to the MongoDB database using Mongoose.
 * It reads the database connection string from the environment variables.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB cluster
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    } catch (err) {
        // Log the specific error message to the console
        console.error('--- MONGODB CONNECTION ERROR ---');
        console.error(err.message);
        console.error('---------------------------------');
        console.log('Server is shutting down due to database connection failure.');
        // Exit the process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
