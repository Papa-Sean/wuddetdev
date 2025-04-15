const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const config = require('./config/app.config');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const postRoutes = require('./routes/post.routes');
const contactRoutes = require('./routes/contact.routes');
const adminRoutes = require('./routes/admin.routes');
const statsRoutes = require('./routes/stats.routes');

// Create Express app
const app = express();

// Connect to MongoDB
mongoose
	.connect(config.db.uri, config.db.options)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(helmet()); // Security headers

// Update CORS configuration to allow credentials
app.use(
	cors({
		origin: function (origin, callback) {
			// Allow requests with no origin (like mobile apps, curl requests)
			const allowedOrigins = Array.isArray(config.server.corsOrigin)
				? config.server.corsOrigin
				: [config.server.corsOrigin];

			// For development, allow requests with no origin (local requests)
			if (!origin) return callback(null, true);

			if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
				callback(null, true);
			} else {
				console.log('Blocked by CORS: ', origin);
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
);

app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // HTTP request logger

// API Routes
app.use(`${config.server.apiPrefix}/auth`, authRoutes);
app.use(`${config.server.apiPrefix}/users`, userRoutes);
app.use(`${config.server.apiPrefix}/projects`, projectRoutes);
app.use(`${config.server.apiPrefix}/posts`, postRoutes);
app.use(`${config.server.apiPrefix}/contact`, contactRoutes);
app.use(`${config.server.apiPrefix}/admin`, adminRoutes);
app.use(`${config.server.apiPrefix}/stats`, statsRoutes);

// Health check endpoint
app.get(`${config.server.apiPrefix}/health`, (req, res) => {
	res.status(200).json({ status: 'ok', environment: config.server.nodeEnv });
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ message: 'API endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.statusCode || 500).json({
		error: err.name || 'ServerError',
		message: err.message || 'Internal server error',
	});
});

module.exports = app;
