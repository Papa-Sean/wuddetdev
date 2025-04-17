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
			trim: true,
		},
		technologies: [
			{
				type: String,
				trim: true,
			},
		],
		liveUrl: {
			type: String,
			trim: true,
		},
		repoUrl: {
			type: String,
			trim: true,
		},
		imageUrl: {
			type: String,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		featured: {
			type: Boolean,
			default: false,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
