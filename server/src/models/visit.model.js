const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
	{
		page: String,
		referrer: String,
		userAgent: String,
		screenWidth: Number,
		timestamp: {
			type: Date,
			default: Date.now,
		},
		visitorId: String,
		userId: mongoose.Schema.Types.ObjectId,
		deviceType: {
			type: String,
			enum: ['desktop', 'mobile', 'tablet'],
			default: 'desktop',
		},
		location: {
			region: String,
			country: String,
			city: String,
		},
		pageViews: {
			type: Number,
			default: 1,
		},
	},
	{ timestamps: true }
);

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
