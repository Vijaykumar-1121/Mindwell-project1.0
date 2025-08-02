/**
 * authMiddleware.js
 * -----------------
 * This middleware is responsible for protecting routes that require authentication.
 * It verifies the JSON Web Token (JWT) sent with the request headers. If the token
 * is valid, it attaches the authenticated user's information to the request object,
 * allowing subsequent controller functions to access it. If the token is invalid
 * or missing, it returns an error and denies access.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to the request object
        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};
