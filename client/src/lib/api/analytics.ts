const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const analyticsFetch = async (endpoint: string, options?: RequestInit) => {
	const response = await fetch(`${API_URL.replace('/api', '')}${endpoint}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options?.headers || {}),
		},
		credentials: 'include',
	});

	if (!response.ok) {
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
