// Helper functions for the portfolio page

/**
 * Generates a background color class for project cards when no images are available
 */
export const getProjectImage = (path: string | undefined): string => {
	// For demo purposes, use colored backgrounds
	const colors = [
		'bg-blue-100',
		'bg-green-100',
		'bg-purple-100',
		'bg-amber-100',
		'bg-pink-100',
		'bg-cyan-100',
	];

	// If path is undefined or doesn't contain 'project', return a default color
	if (!path || !path.includes('project')) {
		// Generate a consistent color based on current time to avoid flashing
		const index = Math.floor(Date.now() / 1000) % colors.length;
		return colors[index];
	}

	// Otherwise, extract the index from the path
	try {
		const index = parseInt(path.split('project')[1].split('.')[0]) - 1;
		return colors[Math.abs(index) % colors.length]; // Using Math.abs to handle negative indices
	} catch (error) {
		// Fallback to a default color if parsing fails
		return colors[0];
	}
};
