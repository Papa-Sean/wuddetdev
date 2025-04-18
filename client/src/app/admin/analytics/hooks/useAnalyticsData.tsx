import { useState, useEffect } from 'react';
import { analyticsApi } from '@/lib/api/analytics';
import { TimeRange, AnalyticsData } from '../types';

export default function useAnalyticsData(initialTimeRange: TimeRange = '30d') {
	const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<AnalyticsData | null>(null);
	const [error, setError] = useState<string | null>(null);

	// New state for Google Analytics data
	const [gaGeoData, setGaGeoData] = useState<{
		locations: Array<{ region: string; country: string; visits: number }>;
		totalVisits: number;
	} | null>(null);
	const [isLoadingGa, setIsLoadingGa] = useState(true);

	const fetchAnalytics = async () => {
		setIsLoading(true);
		setError(null);

		try {
			// Fetch your regular analytics data
			const analyticsData = await analyticsApi.getAnalyticsData(
				timeRange
			);

			if (
				analyticsData &&
				analyticsData.dailyTraffic &&
				analyticsData.dailyTraffic.length > 0
			) {
				setData(analyticsData);
			} else {
				setData(generateMockData(timeRange));
			}
		} catch (error) {
			console.error('Error fetching analytics:', error);
			setError('Failed to load analytics data');
			setData(generateMockData(timeRange));
		} finally {
			setIsLoading(false);
		}
	};

	// Modify the existing function to use the Express endpoint
	const fetchGoogleAnalyticsData = async () => {
		try {
			setIsLoadingGa(true);

			// Use the same base URL as your other analytics endpoints
			const baseUrl = getBaseUrl();
			const url = `${baseUrl}/analytics/geographic`;

			const response = await fetch(url, {
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch GA data: ${response.status}`);
			}

			const data = await response.json();
			setGaGeoData(data);
		} catch (error) {
			console.error(
				'Error fetching Google Analytics geographic data:',
				error
			);
			setGaGeoData(null);
		} finally {
			setIsLoadingGa(false);
		}
	};

	useEffect(() => {
		fetchAnalytics();
		fetchGoogleAnalyticsData(); // Add this call
	}, [timeRange]);

	return {
		data,
		isLoading,
		error,
		timeRange,
		setTimeRange,
		refreshData: fetchAnalytics,
		checkStatus: async () => {
			try {
				const baseUrl =
					process.env.NODE_ENV === 'production'
						? (
								process.env.NEXT_PUBLIC_API_URL ||
								'https://wuddet.com'
						  ).replace('/api', '')
						: 'http://localhost:3001';

				const url = `${baseUrl}/analytics/status`;
				const response = await fetch(url, { credentials: 'include' });

				if (!response.ok) {
					throw new Error(
						`Status check failed with code: ${response.status}`
					);
				}

				return await response.json();
			} catch (error) {
				throw error;
			}
		},
		gaGeoData,
		isLoadingGa,
	};
}

// Include your generateMockData function from the original file
function generateMockData(range: string) {
	// Copy all the mock data generation logic from the original file
}

// Helper function to get the base URL
function getBaseUrl() {
	return process.env.NODE_ENV === 'production'
		? (process.env.NEXT_PUBLIC_API_URL || 'https://wuddet.com').replace(
				'/api',
				''
		  )
		: 'http://localhost:3001';
}
