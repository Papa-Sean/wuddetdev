const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const {
	authenticateToken,
	isAdmin,
	isResourceOwner,
} = require('../middleware/auth.middleware');

// Get all posts with pagination
router.get('/', async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		// Filter options
		const filter = {};
		if (req.query.location) {
			filter.location = { $regex: req.query.location, $options: 'i' };
		}

		// Sort options
		let sort = { isPinned: -1, createdAt: -1 }; // Default: pinned first, then newest
		if (req.query.sort === 'oldest') {
			sort = { isPinned: -1, createdAt: 1 };
		}

		// Query posts with pagination
		const posts = await Post.find(filter)
			.populate('author', 'name profilePic')
			.populate('comments.author', 'name profilePic')
			.sort(sort)
			.skip(skip)
			.limit(limit);

		// Get total count for pagination info
		const total = await Post.countDocuments(filter);

		res.json({
			posts,
			pagination: {
				total,
				page,
				limit,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		next(error);
	}
});

// Get single post by ID
router.get('/:id', async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id)
			.populate('author', 'name profilePic')
			.populate('comments.author', 'name profilePic');

		if (!post) {
			return res.status(404).json({
				error: 'NotFoundError',
				message: 'Post not found',
			});
		}

		res.json(post);
	} catch (error) {
		next(error);
	}
});

// Create a new post
router.post('/', authenticateToken, async (req, res, next) => {
	try {
		const { title, content, eventDate, location } = req.body;

		// Validate required fields
		if (!title || !content) {
			return res.status(400).json({
				error: 'ValidationError',
				message: 'Title and content are required',
			});
		}

		// Validate content length
		if (content.length > 280) {
			return res.status(400).json({
				error: 'ValidationError',
				message: 'Content exceeds 280 characters',
			});
		}

		// Create new post
		const post = new Post({
			title,
			content,
			eventDate,
			location,
			author: req.user._id,
		});

		await post.save();

		// Populate author info for response
		await post.populate('author', 'name profilePic');

		res.status(201).json(post);
	} catch (error) {
		next(error);
	}
});

// Update a post (owner or admin)
router.put(
	'/:id',
	authenticateToken,
	isResourceOwner(Post, 'id'),
	async (req, res, next) => {
		try {
			const { title, content, eventDate, location } = req.body;

			// Validate content length if provided
			if (content && content.length > 280) {
				return res.status(400).json({
					error: 'ValidationError',
					message: 'Content exceeds 280 characters',
				});
			}

			// Create update object with only provided fields
			const updates = {};
			if (title) updates.title = title;
			if (content) updates.content = content;
			if (eventDate !== undefined) updates.eventDate = eventDate;
			if (location !== undefined) updates.location = location;

			// Update post
			const post = req.resource; // Already fetched by isResourceOwner middleware

			// Apply updates
			Object.assign(post, updates);
			await post.save();

			// Populate author for response
			await post.populate('author', 'name profilePic');

			res.json(post);
		} catch (error) {
			next(error);
		}
	}
);

// Delete a post (owner or admin)
router.delete(
	'/:id',
	authenticateToken,
	isResourceOwner(Post, 'id'),
	async (req, res, next) => {
		try {
			// Use deleteOne instead of remove
			await Post.deleteOne({ _id: req.resource._id });

			res.status(204).end();
		} catch (error) {
			next(error);
		}
	}
);

// Add a comment to a post
router.post('/:id/comments', authenticateToken, async (req, res, next) => {
	try {
		const { content } = req.body;

		// Validate content
		if (!content) {
			return res.status(400).json({
				error: 'ValidationError',
				message: 'Comment content is required',
			});
		}

		// Validate content length
		if (content.length > 280) {
			return res.status(400).json({
				error: 'ValidationError',
				message: 'Comment exceeds 280 characters',
			});
		}

		// Find post
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({
				error: 'NotFoundError',
				message: 'Post not found',
			});
		}

		// Add comment
		const comment = {
			content,
			author: req.user._id,
			createdAt: Date.now(),
		};

		post.comments.push(comment);
		await post.save();

		// Get newly added comment (last one)
		const newComment = post.comments[post.comments.length - 1];

		// Populate author for this specific comment
		await Post.populate(post, {
			path: 'comments.author',
			select: 'name profilePic',
			match: { _id: newComment.author },
		});

		res.status(201).json(newComment);
	} catch (error) {
		next(error);
	}
});

// Delete a comment (owner or admin)
router.delete(
	'/:postId/comments/:commentId',
	authenticateToken,
	async (req, res, next) => {
		try {
			const { postId, commentId } = req.params;

			// Find post
			const post = await Post.findById(postId);
			if (!post) {
				return res.status(404).json({
					error: 'NotFoundError',
					message: 'Post not found',
				});
			}

			// Find comment
			const comment = post.comments.id(commentId);
			if (!comment) {
				return res.status(404).json({
					error: 'NotFoundError',
					message: 'Comment not found',
				});
			}

			// Check if user is admin or comment owner
			if (
				req.user.role !== 'admin' &&
				!comment.author.equals(req.user._id)
			) {
				return res.status(403).json({
					error: 'ForbiddenError',
					message: 'Not authorized to delete this comment',
				});
			}

			// Remove comment using pull instead of remove method
			post.comments.pull({ _id: commentId });
			await post.save();

			res.status(204).end();
		} catch (error) {
			next(error);
		}
	}
);

// Toggle pin status of a post (admin only)
router.put('/:id/pin', authenticateToken, isAdmin, async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({
				error: 'NotFoundError',
				message: 'Post not found',
			});
		}

		post.isPinned = !post.isPinned;
		await post.save();

		res.json({ id: post._id, isPinned: post.isPinned });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
