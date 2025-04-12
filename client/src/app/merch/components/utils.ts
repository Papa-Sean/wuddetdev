// Utility functions for the merch page

/**
 * Generates a background color class based on the image path
 * For use when real images aren't available
 */
export const getMerchImage = (path: string): string => {
	// For demo purposes, use colored backgrounds
	const colors = [
		'bg-blue-100',
		'bg-green-100',
		'bg-purple-100',
		'bg-amber-100',
		'bg-pink-100',
		'bg-cyan-100',
	];
	const index =
		parseInt(path.split(/[\/.]/).reverse()[1].replace(/\D/g, '')) - 1;
	return colors[index % colors.length];
};
