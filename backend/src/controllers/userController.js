/**
 * userController.js
 * -----------------
 * This file contains the logic for handling user management actions
 * performed by an administrator.
 */

const User = require('../models/User');


/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
    try {
        const { 
            name, email, phone, bio, username, 
            timezone, therapyPreference, emergencyContactName, 
            emergencyContactPhone, avatarBase64, isPrivate 
        } = req.body;
        
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        user.name = name !== undefined ? name : user.name;
        user.email = email !== undefined ? email : user.email;
        user.username = username !== undefined ? username : user.username;
        user.bio = bio !== undefined ? bio : user.bio;
        user.timezone = timezone !== undefined ? timezone : user.timezone;
        user.therapyPreference = therapyPreference !== undefined ? therapyPreference : user.therapyPreference;
        user.emergencyContactName = emergencyContactName !== undefined ? emergencyContactName : user.emergencyContactName;
        user.emergencyContactPhone = emergencyContactPhone !== undefined ? emergencyContactPhone : user.emergencyContactPhone;
        user.isPrivate = isPrivate !== undefined ? isPrivate : user.isPrivate;
        
        // Only update avatar if a new one is provided (could be large)
        if (avatarBase64 !== undefined) {
            user.avatarBase64 = avatarBase64;
        }
        
        await user.save();
        
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.followUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.user.id;

        if (targetUserId === currentUserId) {
            return res.status(400).json({ success: false, message: "You cannot follow yourself" });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!currentUser.following.includes(targetUserId)) {
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
            await currentUser.save();
            await targetUser.save();
        }

        res.status(200).json({ success: true, message: "Successfully followed user" });
    } catch (error) {
        console.error("Follow error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.user.id;

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });

        currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ success: true, message: "Successfully unfollowed user" });
    } catch (error) {
        console.error("Unfollow error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.discoverUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id }, role: 'student', isPrivate: { $ne: true } })
            .select('name username avatarBase64');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Discover error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/**
 * @desc    Get populated followers and following lists
 * @route   GET /api/users/network
 * @access  Private
 */
exports.getNetwork = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('followers', 'name username avatarBase64')
            .populate('following', 'name username avatarBase64');
            
        res.status(200).json({ 
            success: true, 
            data: {
                followers: user.followers,
                following: user.following
            } 
        });
    } catch (error) {
        console.error("Network error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/**
 * @desc    Remove a user who is following the current user
 * @route   POST /api/users/remove-follower/:id
 * @access  Private
 */
exports.removeFollower = async (req, res) => {
    try {
        const targetUserId = req.params.id; // The person we want to remove from our followers
        const currentUserId = req.user.id;

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });

        // Remove target from my followers
        currentUser.followers = currentUser.followers.filter(id => id.toString() !== targetUserId);
        // Remove me from their following
        targetUser.following = targetUser.following.filter(id => id.toString() !== currentUserId);

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ success: true, message: "Follower removed" });
    } catch (error) {
        console.error("Remove follower error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/**
 * @desc    Change password
 * @route   PUT /api/users/password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide current and new password' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
        }

        const user = await User.findById(req.user.id).select('+password');
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save(); // bcrypt hashing runs via pre-save hook
        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Delete own account
 * @route   DELETE /api/users/account
 * @access  Private
 */
exports.deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ success: false, message: 'Please provide your password to confirm' });
        }

        const user = await User.findById(req.user.id).select('+password');
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Password is incorrect' });
        }

        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
