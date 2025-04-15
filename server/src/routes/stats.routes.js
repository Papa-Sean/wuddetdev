const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Project = require('../models/project.model');

// Get site statistics
router.get('/', async (req, res, next) => {
	try {
		const [userCount, eventCount, projectCount] = await Promise.all([
			User.countDocuments({ role: 'member' }),
			Post.countDocuments({ eventDate: { $exists: true, $ne: null } }),
			Project.countDocuments(),
		]);

		res.json({
			activeUsers: userCount,
			events: eventCount,
			projects: projectCount,
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
