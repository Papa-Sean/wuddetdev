/**
 * Application Configuration
 * Centralizes all environment variables and configuration settings
 */

require('dotenv').config();

const config = {
	// Server settings
	server: {
		port: process.env.PORT || 3001,
		nodeEnv: process.env.NODE_ENV || 'development',
		apiPrefix: '/api',
		corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
	},

	// Database settings
	db: {
		uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/wuddevdet',
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},

	// Authentication settings
	auth: {
		jwtSecret:
			process.env.JWT_SECRET ||
			'your_jwt_secret_key_change_in_production',
		jwtExpiration: process.env.JWT_EXPIRATION || '24h',
		saltRounds: 10,
	},

	// Email settings (for future use)
	email: {
		host: process.env.EMAIL_HOST || '',
		port: process.env.EMAIL_PORT || 587,
		user: process.env.EMAIL_USER || '',
		pass: process.env.EMAIL_PASS || '',
		from: process.env.EMAIL_FROM || 'noreply@wuddevdet.com',
	},

	// Location settings
	location: {
		defaultCity: 'Detroit',
		restrictedState: 'Michigan', // For Michigan-only validation
	},
};

module.exports = config;
