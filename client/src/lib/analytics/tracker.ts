export const trackPageView = (page: string) => {
	// Get the root URL for the site in production, use API URL for development
	const baseUrl =
		process.env.NODE_ENV === 'production'
			? window.location.origin // Gets the root domain (e.g. https://wuddet.com)
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
