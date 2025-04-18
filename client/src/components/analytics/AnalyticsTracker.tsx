'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export function AnalyticsTracker() {
	const pathname = usePathname();

	useEffect(() => {
		// Track page views
		const trackPage = async () => {
			// Generate a visitor ID and store it if it doesn't exist
			let visitorId = localStorage.getItem('visitorId');
			if (!visitorId) {
				visitorId = uuidv4();
				localStorage.setItem('visitorId', visitorId);
			}

			// Get browser locale for approximate location inference
			const userLocale = navigator.language || 'en-US';
			const defaultLocation = {
				country: 'United States',
				region: 'Michigan',
				city: 'Detroit',
			};

			// For real location tracking, you'd use a geolocation API service
			// This is just using browser data as a fallback

			try {
				await fetch('/api/analytics/pageview', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						page: pathname,
						visitorId,
						timestamp: new Date().toISOString(),
						referrer: document.referrer,
						userAgent: navigator.userAgent,
						screenWidth: window.innerWidth,
						location: defaultLocation,
					}),
				});
			} catch (error) {
				console.error('Error tracking pageview:', error);
			}
		};

		trackPage();
	}, [pathname]);

	return null; // This component doesn't render anything
}
