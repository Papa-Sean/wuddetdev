const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/contact-message.model');

// Submit a contact message (guest can access)
router.post('/', async (req, res, next) => {
	try {
		const { name, email, message } = req.body;

		// Validate required fields
		if (!name || !email || !message) {
			return res.status(400).json({
				error: 'ValidationError',
				message: 'Name, email, and message are required',
			});
		}

		// Basic email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({
				error: 'ValidationError',
				message: 'Invalid email format',
			});
		}

		// Create contact message
		const contactMessage = new ContactMessage({
			name,
			email,
			message,
		});

		await contactMessage.save();

		res.status(201).json({
			message:
				'Your message has been received. Thank you for contacting us!',
			id: contactMessage._id,
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
