const fs = require('fs');
const path = require('path');

// Path to the API directory
const apiDir = path.join(__dirname, 'src', 'app', 'api');

// Check if the API directory exists
if (fs.existsSync(apiDir)) {
	console.log('Temporarily renaming API directory for static build...');
	fs.renameSync(apiDir, `${apiDir}_temp`);

	// Create a cleanup function to restore the API directory after build
	process.on('exit', () => {
		if (fs.existsSync(`${apiDir}_temp`)) {
			fs.renameSync(`${apiDir}_temp`, apiDir);
			console.log('API directory restored.');
		}
	});

	// Also handle signals to ensure cleanup on interruption
	['SIGINT', 'SIGTERM'].forEach((signal) => {
		process.on(signal, () => {
			if (fs.existsSync(`${apiDir}_temp`)) {
				fs.renameSync(`${apiDir}_temp`, apiDir);
				console.log('API directory restored.');
			}
			process.exit();
		});
	});
}
