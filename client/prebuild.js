const fs = require('fs');
const path = require('path');

// Create a flag file instead of moving directories
fs.writeFileSync(
	path.join(__dirname, '.skip-api-routes'),
	'This file tells the build process to skip API routes'
);

console.log('Created build flag file to skip API routes');
