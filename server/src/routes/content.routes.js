const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const Project = require('../models/project.model');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Get all content with filters for the admin dashboard
router.get('/', authenticateToken, isAdmin, async (req, res, next) => {
	try {
		const { type, filter, search, page = 1, limit = 10 } = req.query;
		const skip = (parseInt(page) - 1) * parseInt(limit);

		let posts = [];
		let projects = [];
		let comments = [];
		let totalPosts = 0;
		let totalProjects = 0;
		let totalComments = 0;

		// Base query conditions
		const postQuery = {};
		const projectQuery = {};

		// Apply search filter
		if (search) {
			postQuery.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ content: { $regex: search, $options: 'i' } },
			];

			projectQuery.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
			];
		}

		// Apply type filters
		if (filter === 'pinned') {
			postQuery.isPinned = true;
		} else if (filter === 'featured') {
			projectQuery.featured = true;
		} else if (filter === 'recent') {
			const oneWeekAgo = new Date();
			oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
			postQuery.createdAt = { $gte: oneWeekAgo };
			projectQuery.createdAt = { $gte: oneWeekAgo };
		}

		// Fetch data based on the requested type
		if (!type || type === 'posts' || type === 'all') {
			posts = await Post.find(postQuery)
				.populate('author', 'name email profilePic')
				.populate('comments.author', 'name email profilePic')
				.sort({ isPinned: -1, createdAt: -1 })
				.skip(skip)
				.limit(parseInt(limit));

			totalPosts = await Post.countDocuments(postQuery);
		}

		if (!type || type === 'projects' || type === 'all') {
			projects = await Project.find(projectQuery)
				.populate('author', 'name email')
				.sort({ featured: -1, createdAt: -1 })
				.skip(skip)
				.limit(parseInt(limit));

			totalProjects = await Project.countDocuments(projectQuery);
		}

		// Extract comments from all posts if comments are requested
		if (type === 'comments') {
			let allPosts = await Post.find({
				comments: { $exists: true, $ne: [] },
			})
				.populate('author', 'name email profilePic')
				.populate('comments.author', 'name email profilePic');

			// Flatten all comments and add post reference
			let allComments = [];
			allPosts.forEach((post) => {
				const commentsWithPost = post.comments.map((comment) => {
					// Create a clean comment object with additional postInfo
					return {
						_id: comment._id,
						content: comment.content,
						author: comment.author,
						createdAt: comment.createdAt,
						postId: post._id,
						postTitle: post.title,
					};
				});
				allComments = [...allComments, ...commentsWithPost];
			});

			// Apply search filter to comments
			if (search) {
				allComments = allComments.filter((comment) =>
					comment.content.toLowerCase().includes(search.toLowerCase())
				);
			}

			// Apply recent filter to comments
			if (filter === 'recent') {
				const oneWeekAgo = new Date();
				oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
				allComments = allComments.filter(
					(comment) => new Date(comment.createdAt) > oneWeekAgo
				);
			}

			totalComments = allComments.length;

			// Apply pagination to comments
			comments = allComments
				.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
				.slice(skip, skip + parseInt(limit));
		}

		res.json({
			posts,
			projects,
			comments,
			pagination: {
				posts: {
					total: totalPosts,
					page: parseInt(page),
					limit: parseInt(limit),
				},
				projects: {
					total: totalProjects,
					page: parseInt(page),
					limit: parseInt(limit),
				},
				comments: {
					total: totalComments,
					page: parseInt(page),
					limit: parseInt(limit),
				},
			},
		});
	} catch (error) {
		next(error);
	}
});

// Toggle feature status for a project
router.put(
	'/projects/:id/feature',
	authenticateToken,
	isAdmin,
	async (req, res, next) => {
		try {
			const project = await Project.findById(req.params.id);

			if (!project) {
				return res.status(404).json({
					error: 'NotFoundError',
					message: 'Project not found',
				});
			}

			// Toggle featured status
			project.featured = !project.featured;
			await project.save();

			res.json({ id: project._id, featured: project.featured });
		} catch (error) {
			next(error);
		}
	}
);

// Bulk operations for content items
router.post(
	'/bulk/:action',
	authenticateToken,
	isAdmin,
	async (req, res, next) => {
		try {
			const { action } = req.params;
			const { items, itemType } = req.body;

			if (!items || !Array.isArray(items) || items.length === 0) {
				return res.status(400).json({
					error: 'ValidationError',
					message: 'Items array is required and must not be empty',
				});
			}

			if (
				!['delete', 'pin', 'unpin', 'feature', 'unfeature'].includes(
					action
				)
			) {
				return res.status(400).json({
					error: 'ValidationError',
					message:
						'Invalid action. Must be one of: delete, pin, unpin, feature, unfeature',
				});
			}

			if (!['post', 'project', 'comment'].includes(itemType)) {
				return res.status(400).json({
					error: 'ValidationError',
					message:
						'Invalid item type. Must be one of: post, project, comment',
				});
			}

			let result = { success: true, count: 0, items: [] };

			// Process based on action and item type
			switch (action) {
				case 'delete':
					if (itemType === 'post') {
						const deleteResult = await Post.deleteMany({
							_id: { $in: items },
						});
						result.count = deleteResult.deletedCount;
					} else if (itemType === 'project') {
						const deleteResult = await Project.deleteMany({
							_id: { $in: items },
						});
						result.count = deleteResult.deletedCount;
					} else if (itemType === 'comment') {
						// Comments are trickier since they're embedded in posts
						// For each comment ID, find its post and pull the comment
						for (const commentId of items) {
							const post = await Post.findOne({
								'comments._id': commentId,
							});
							if (post) {
								post.comments.pull({ _id: commentId });
								await post.save();
								result.count++;
								result.items.push(commentId);
							}
						}
					}
					break;

				case 'pin':
				case 'unpin':
					if (itemType === 'post') {
						const updateResult = await Post.updateMany(
							{ _id: { $in: items } },
							{ $set: { isPinned: action === 'pin' } }
						);
						result.count = updateResult.modifiedCount;
					}
					break;

				case 'feature':
				case 'unfeature':
					if (itemType === 'project') {
						const updateResult = await Project.updateMany(
							{ _id: { $in: items } },
							{ $set: { featured: action === 'feature' } }
						);
						result.count = updateResult.modifiedCount;
					}
					break;
			}

			res.json(result);
		} catch (error) {
			next(error);
		}
	}
);

// Get content counts
router.get('/counts', authenticateToken, isAdmin, async (req, res, next) => {
	try {
		const [postsCount, projectsCount, commentsCount] = await Promise.all([
			Post.countDocuments(),
			Project.countDocuments(),
			// For comments, we aggregate the counts from all posts' comments arrays
			Post.aggregate([
				{ $project: { commentCount: { $size: '$comments' } } },
				{ $group: { _id: null, total: { $sum: '$commentCount' } } },
			]).then((result) => (result.length > 0 ? result[0].total : 0)),
		]);

		res.json({
			posts: postsCount,
			projects: projectsCount,
			comments: commentsCount,
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
