/**
 * userController.js
 * -----------------
 * This file contains the logic for handling user management actions
 * performed by an administrator.
 */

const User = require('../models/User');

/**
 * @desc    Get all users with the role 'student'
 * @route   GET /api/users
 * @access  Private (Admin)
 */
exports.getUsers = async (req, res) => {
    // Ensure the logged-in user is an admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to access this resource' });
    }

    try {
        // Find all users who are students and sort by creation date
        const users = await User.find({ role: 'student' }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Suspend a user account (placeholder)
 * @route   PUT /api/users/:id/suspend
 * @access  Private (Admin)
 */
exports.suspendUser = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // In a real application, you might add an `isSuspended` flag to the User model.
        // For now, we'll just log the action.
        console.log(`User ${user.name} with ID ${user._id} has been suspended.`);

        res.status(200).json({ success: true, message: `User ${user.name} has been suspended.` });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
