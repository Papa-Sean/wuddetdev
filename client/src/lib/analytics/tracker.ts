export const trackPageView = (page: string) => {
	// Add logging to debug URL construction in production
	console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

	// Simplify URL construction to avoid manipulation errors
	const baseUrl =
		process.env.NODE_ENV === 'production'
			? 'https://www.wuddetdev.com/api' // Replace with your actual domain
			: 'http://localhost:3001';

	const analyticsUrl = `${baseUrl}/analytics/pageview`;

	console.log('Sending analytics to:', analyticsUrl);

	fetch(analyticsUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			page,
			referrer: document.referrer,
			userAgent: navigator.userAgent,
			screenWidth: window.innerWidth,
			timestamp: new Date().toISOString(),
			visitorId: getOrCreateVisitorId(),
		}),
	}).catch((err) => console.error('Error tracking pageview:', err));
};

// Helper to get or create a visitor ID
const getOrCreateVisitorId = () => {
	const storageKey = 'wuddet_visitor_id';
	let visitorId = localStorage.getItem(storageKey);

	if (!visitorId) {
		visitorId = generateUUID();
		localStorage.setItem(storageKey, visitorId);
	}

	return visitorId;
};

// Simple UUID generator
const generateUUID = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
		/[xy]/g,
		function (c) {
			const r = (Math.random() * 16) | 0,
				v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		}
	);
};
