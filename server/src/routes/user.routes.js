const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { authenticateToken } = require('../middleware/auth.middleware');

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
	res.json(req.user);
});

// Update current user profile
router.put('/me', authenticateToken, async (req, res, next) => {
	try {
		const { name, bio, profilePic, location } = req.body;

		// Only allow certain fields to be updated
		const updates = {};
		if (name) updates.name = name;
		if (bio !== undefined) updates.bio = bio;
		if (profilePic) updates.profilePic = profilePic;
		if (location) updates.location = location;

		// Update user
		const updatedUser = await User.findByIdAndUpdate(
			req.user._id,
			{ $set: updates },
			{ new: true, runValidators: true }
		);

		if (!updatedUser) {
			return res.status(404).json({
				error: 'NotFoundError',
				message: 'User not found',
			});
		}

		res.json(updatedUser);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
