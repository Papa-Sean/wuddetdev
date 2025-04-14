const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const ContactMessage = require('../models/contact-message.model');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Get all contact messages
router.get(
	'/contact-messages',
	authenticateToken,
	isAdmin,
	async (req, res, next) => {
		try {
			const messages = await ContactMessage.find().sort({
				createdAt: -1,
			});

			res.json(messages);
		} catch (error) {
			next(error);
		}
	}
);

// Update contact message response status
router.put(
	'/contact-messages/:id/status',
	authenticateToken,
	isAdmin,
	async (req, res, next) => {
		try {
			const message = await ContactMessage.findById(req.params.id);

			if (!message) {
				return res.status(404).json({
					error: 'NotFoundError',
					message: 'Message not found',
				});
			}

			message.isResponded = !message.isResponded;
			await message.save();

			res.json(message);
		} catch (error) {
			next(error);
		}
	}
);

// Add this route to handle message deletion
router.delete(
	'/contact-messages/:id',
	authenticateToken,
	isAdmin,
	async (req, res, next) => {
		try {
			const message = await ContactMessage.findByIdAndDelete(
				req.params.id
			);

			if (!message) {
				return res.status(404).json({
					error: 'NotFoundError',
					message: 'Message not found',
				});
			}

			res.status(204).end();
		} catch (error) {
			next(error);
		}
	}
);

// Get all users
router.get('/users', authenticateToken, isAdmin, async (req, res, next) => {
	try {
		const users = await User.find()
			.select('-password')
			.sort({ createdAt: -1 });

		res.json(users);
	} catch (error) {
		next(error);
	}
});

// Delete a user
router.delete(
	'/users/:id',
	authenticateToken,
	isAdmin,
	async (req, res, next) => {
		try {
			const user = await User.findById(req.params.id);

			if (!user) {
				return res.status(404).json({
					error: 'NotFoundError',
					message: 'User not found',
				});
			}

			// Prevent admin from deleting themselves
			if (user._id.equals(req.user._id)) {
				return res.status(400).json({
					error: 'BadRequestError',
					message: 'You cannot delete your own account',
				});
			}

			await user.remove();
			res.status(204).end();
		} catch (error) {
			next(error);
		}
	}
);

// Update user role
router.put(
	'/users/:id/role',
	authenticateToken,
	isAdmin,
	async (req, res, next) => {
		try {
			const { role } = req.body;

			// Validate role
			if (!role || !['member', 'admin'].includes(role)) {
				return res.status(400).json({
					error: 'ValidationError',
					message: 'Role must be either "member" or "admin"',
				});
			}

			const user = await User.findById(req.params.id);

			if (!user) {
				return res.status(404).json({
					error: 'NotFoundError',
					message: 'User not found',
				});
			}

			// Update role
			user.role = role;
			await user.save();

			res.json(user);
		} catch (error) {
			next(error);
		}
	}
);

module.exports = router;
