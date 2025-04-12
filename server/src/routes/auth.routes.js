const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config/app.config');
const { authenticateToken } = require('../middleware/auth.middleware');

// Helper function to generate token
const generateToken = (user) => {
	return jwt.sign({ id: user._id, role: user.role }, config.auth.jwtSecret, {
		expiresIn: config.auth.jwtExpiration,
	});
};

// Sign up
router.post('/signup', async (req, res, next) => {
	try {
		const { email, password, name, location } = req.body;

		// Validate required fields
		if (!email || !password || !name || !location) {
			return res.status(400).json({
				error: 'ValidationError',
				message: 'Email, password, name, and location are required',
			});
		}

		// Validate Michigan cities
		const michiganCities = [
			'Detroit',
			'Grand Rapids',
			'Ann Arbor',
			'Lansing',
			'Flint',
			'Dearborn',
			'Troy',
			'Farmington Hills',
			'Warren',
			'Livonia',
			'Sterling Heights',
			'Royal Oak',
			'Southfield',
			'Novi',
			'Other',
		];

		// Check if the submitted location is a valid Michigan city
		// Allow "Other" as a valid option
		if (!michiganCities.includes(location)) {
			return res.status(400).json({
				error: 'LocationError',
				message: 'Location must be in Michigan',
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				error: 'DuplicateError',
				message: 'Email already in use',
			});
		}

		// Create new user
		const user = new User({
			email,
			password,
			name,
			location,
			role: 'member', // Default role
		});

		await user.save();

		// Generate JWT token
		const token = generateToken(user);

		res.status(201).json({
			user: user.toJSON(),
			token,
		});
	} catch (error) {
		next(error);
	}
});

// Login
router.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// Validate required fields
		if (!email || !password) {
			return res.status(400).json({
				error: 'ValidationError',
				message: 'Email and password are required',
			});
		}

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				error: 'AuthError',
				message: 'Invalid email or password',
			});
		}

		// Verify password
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({
				error: 'AuthError',
				message: 'Invalid email or password',
			});
		}

		// Generate JWT token
		const token = generateToken(user);

		res.json({
			user: user.toJSON(),
			token,
		});
	} catch (error) {
		next(error);
	}
});

// Logout (token invalidation is typically handled client-side)
router.post('/logout', authenticateToken, (req, res) => {
	// In a real system, you might want to add the token to a blacklist
	// or implement token revocation logic
	res.json({ message: 'Logged out successfully' });
});

module.exports = router;
