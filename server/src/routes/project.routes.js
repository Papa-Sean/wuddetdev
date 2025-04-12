const express = require('express');
const router = express.Router();
const Project = require('../models/project.model');
const {
	authenticateToken,
	isAdmin,
	isResourceOwner,
} = require('../middleware/auth.middleware');

// Get all projects
router.get('/', async (req, res, next) => {
	try {
		const projects = await Project.find()
			.populate('creator', 'name') // Include creator's name only
			.sort({ createdAt: -1 });

		res.json(projects);
	} catch (error) {
		next(error);
	}
});

// Get project by id
router.get('/:id', async (req, res, next) => {
	try {
		const project = await Project.findById(req.params.id).populate(
			'creator',
			'name email'
		);

		if (!project) {
			return res.status(404).json({
				error: 'NotFoundError',
				message: 'Project not found',
			});
		}

		res.json(project);
	} catch (error) {
		next(error);
	}
});

// Create a new project (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res, next) => {
	try {
		const { title, description, techStack, prototypeUrl, image } = req.body;

		// Validate required fields
		if (!title || !description) {
			return res.status(400).json({
				error: 'ValidationError',
				message: 'Title and description are required',
			});
		}

		// Create new project
		const project = new Project({
			title,
			description,
			techStack: Array.isArray(techStack) ? techStack : [],
			prototypeUrl,
			image,
			creator: req.user._id,
		});

		await project.save();

		res.status(201).json(project);
	} catch (error) {
		next(error);
	}
});

// Update a project (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res, next) => {
	try {
		const { title, description, techStack, prototypeUrl, image } = req.body;

		// Create update object with only provided fields
		const updates = {};
		if (title) updates.title = title;
		if (description) updates.description = description;
		if (techStack) updates.techStack = techStack;
		if (prototypeUrl !== undefined) updates.prototypeUrl = prototypeUrl;
		if (image !== undefined) updates.image = image;

		// Update project
		const project = await Project.findByIdAndUpdate(
			req.params.id,
			{ $set: updates },
			{ new: true, runValidators: true }
		);

		if (!project) {
			return res.status(404).json({
				error: 'NotFoundError',
				message: 'Project not found',
			});
		}

		res.json(project);
	} catch (error) {
		next(error);
	}
});

// Delete a project (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res, next) => {
	try {
		const project = await Project.findByIdAndDelete(req.params.id);

		if (!project) {
			return res.status(404).json({
				error: 'NotFoundError',
				message: 'Project not found',
			});
		}

		res.status(204).end();
	} catch (error) {
		next(error);
	}
});

module.exports = router;
