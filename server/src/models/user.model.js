const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/app.config');

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			enum: ['member', 'admin'],
			default: 'member',
		},
		location: {
			type: String,
			required: true,
			trim: true,
		},
		bio: {
			type: String,
			trim: true,
		},
		profilePic: {
			type: String,
		},
		status: {
			type: String,
			enum: ['active', 'inactive', 'pending', 'banned'],
			default: 'active',
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		lastLogin: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

// Pre-save middleware to hash the password
userSchema.pre('save', async function (next) {
	// Only hash the password if it's modified or new
	if (!this.isModified('password')) return next();

	try {
		const salt = await bcrypt.genSalt(config.auth.saltRounds);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Method to return user without sensitive data
userSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
