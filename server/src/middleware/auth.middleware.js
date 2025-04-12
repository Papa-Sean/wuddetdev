const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config/app.config');

// Middleware to verify JWT token
exports.authenticateToken = async (req, res, next) => {
	try {
		// Get token from Authorization header
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(' ')[1];

		if (!token) {
			return res.status(401).json({
				error: 'Unauthorized',
				message: 'Access token required',
			});
		}

		// Verify token
		const decoded = jwt.verify(token, config.auth.jwtSecret);
		const user = await User.findById(decoded.id);

		if (!user) {
			return res
				.status(401)
				.json({ error: 'Unauthorized', message: 'User not found' });
		}

		// Attach user to request object
		req.user = user;
		next();
	} catch (error) {
		if (
			error.name === 'JsonWebTokenError' ||
			error.name === 'TokenExpiredError'
		) {
			return res.status(401).json({
				error: 'Unauthorized',
				message: 'Invalid or expired token',
			});
		}
		next(error);
	}
};

// Middleware to check if user is an admin
exports.isAdmin = (req, res, next) => {
	if (!req.user) {
		return res.status(401).json({
			error: 'Unauthorized',
			message: 'Authentication required',
		});
	}

	if (req.user.role !== 'admin') {
		return res.status(403).json({
			error: 'Forbidden',
			message: 'Admin access required',
		});
	}

	next();
};

// Create a more flexible middleware for role checking
exports.hasRole = (roles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({
				error: 'Unauthorized',
				message: 'Authentication required',
			});
		}

		if (Array.isArray(roles)) {
			if (!roles.includes(req.user.role)) {
				return res.status(403).json({
					error: 'Forbidden',
					message: `Required role: ${roles.join(' or ')}`,
				});
			}
		} else if (req.user.role !== roles) {
			return res.status(403).json({
				error: 'Forbidden',
				message: `Required role: ${roles}`,
			});
		}

		next();
	};
};

// Middleware to check if user is authorized to modify a resource
exports.isResourceOwner = (resourceModel, paramIdField = 'id') => {
	return async (req, res, next) => {
		try {
			const resourceId = req.params[paramIdField];
			const resource = await resourceModel.findById(resourceId);

			if (!resource) {
				return res
					.status(404)
					.json({ error: 'NotFound', message: 'Resource not found' });
			}

			// Check if user is admin or resource owner
			const isOwner = req.user._id.equals(
				resource.author || resource.creator
			);

			if (req.user.role === 'admin' || isOwner) {
				req.resource = resource; // Attach resource to request for convenience
				return next();
			}

			res.status(403).json({
				error: 'Forbidden',
				message: 'Not authorized to modify this resource',
			});
		} catch (error) {
			next(error);
		}
	};
};
