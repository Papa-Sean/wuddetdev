const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
	page: { type: String, required: true },
	visitorId: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
	referrer: { type: String },
	userAgent: { type: String },
	screenWidth: { type: Number },
	deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'] },
	location: {
		country: { type: String, default: 'United States' },
		region: { type: String, default: 'Michigan' },
		city: { type: String, default: 'Detroit' },
	},
});

module.exports = mongoose.model('Visit', visitSchema);
