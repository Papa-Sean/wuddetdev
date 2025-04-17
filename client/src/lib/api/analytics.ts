const baseUrl =
	process.env.NODE_ENV === 'production'
		? 'https://www.wuddetdev.com/api' // Replace with your actual domain
		: 'http://localhost:3001';

const analyticsFetch = async (endpoint: string, options?: RequestInit) => {
	console.log(`Fetching analytics from: ${baseUrl}${endpoint}`);

	const response = await fetch(`${baseUrl}${endpoint}`, {
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
};

export const analyticsApi = {
	getAnalyticsData: async (timeRange: '7d' | '30d' | '90d' | 'all') => {
		try {
			// Notice the path changed to match your server registration
			return await analyticsFetch(
				`/analytics/data?timeRange=${timeRange}`
			);
		} catch (error) {
			console.error('Error fetching analytics data:', error);
			throw error;
		}
	},
};
