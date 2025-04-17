'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics/tracker';

export function AnalyticsTracker() {
	const pathname = usePathname();

	// Track page view on route changes
	useEffect(() => {
		trackPageView(pathname);
	}, [pathname]);

	return null; // This component doesn't render anything visible
}
