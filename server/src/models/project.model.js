const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		techStack: {
			type: [String],
			default: [],
		},
		prototypeUrl: {
			type: String,
		},
		image: {
			type: String,
		},
		featured: {
			type: Boolean,
			default: false,
		},
		// Update this field to properly reference the User model
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		// Add this field as an alias for 'author' for backward compatibility
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
