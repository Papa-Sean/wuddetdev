export type TimeRange = '7d' | '30d' | '90d' | 'all';

export interface PageData {
	page: string;
	views: number;
	avgTimeOnPage?: number;
}

export interface LocationData {
	region: string;
	visits: number;
}

export interface DevicesData {
	desktop: number;
	mobile: number;
	tablet: number;
}

export interface AnalyticsData {
	timeRange: TimeRange;
	dailyTraffic: {
		date: string;
		visits: number;
		uniqueVisitors: number;
		pageViews: number;
	}[];
	totals: {
		visits: number;
		uniqueVisitors: number;
		pageViews: number;
		visitsDiff: number;
		visitsDiffPercent: number;
	};
	averages: {
		visitsPerDay: number;
		uniqueVisitorsPerDay: number;
		pageViewsPerDay: number;
	};
	engagement: {
		engagementRate: number;
		avgSessionDuration: number;
		bounceRate: number;
	};
	topPages: PageData[];
	devices: DevicesData;
	locations: LocationData[];
}
