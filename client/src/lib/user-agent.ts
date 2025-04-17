export function getDeviceType(
	userAgent: string,
	screenWidth: number
): 'mobile' | 'tablet' | 'desktop' {
	// Check for mobile devices first
	const mobileRegex =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

	if (mobileRegex.test(userAgent)) {
		// Differentiate between tablets and phones based on screen width
		if (/iPad|Tablet/.test(userAgent) || screenWidth > 768) {
			return 'tablet';
		}
		return 'mobile';
	}

	// Default to desktop for non-mobile devices
	return 'desktop';
}
