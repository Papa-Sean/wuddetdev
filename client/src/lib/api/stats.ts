// Base URL for API requests
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface SiteStats {
	activeUsers: number;
	events: number;
	projects: number;
}

// Fetch site statistics
export const fetchSiteStats = async (): Promise<SiteStats> => {
	try {
		const response = await fetch(`${API_URL}/stats`);

		if (!response.ok) {
			throw new Error('Failed to fetch site statistics');
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching site statistics:', error);
		// Return default values if API call fails
		return {
			activeUsers: 0,
			events: 0,
			projects: 0,
		};
	}
};
