// Fix URL construction for production environment
const getBaseUrl = () => {
	// For production environments, use the site's root URL
	if (process.env.NODE_ENV === 'production') {
		return typeof window !== 'undefined' ? window.location.origin : '';
	}
	// For development
	return 'http://localhost:3001';
};

const analyticsFetch = async (endpoint: string, options?: RequestInit) => {
	const baseUrl = getBaseUrl();
	const url = `${baseUrl}${endpoint}`;

	console.log(`Fetching analytics from: ${url}`);

	try {
		const response = await fetch(url, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(options?.headers || {}),
			},
			credentials: 'include',
		});

		if (!response.ok) {
			console.error(`Analytics API error: ${response.status}`);
			throw new Error(`Analytics API error: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Analytics fetch error: ${error.message}`);
			throw error;
		}
		throw new Error('Unknown analytics fetch error');
	}
};

export const analyticsApi = {
	getAnalyticsData: async (timeRange: '7d' | '30d' | '90d' | 'all') => {
		try {
			return await analyticsFetch(
				`/analytics/data?timeRange=${timeRange}`
			);
		} catch (error) {
			console.error('Error fetching analytics data:', error);
			// Return null to trigger the fallback to mock data
			return null;
		}
	},
};
