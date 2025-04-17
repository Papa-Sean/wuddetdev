'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/guards/AdminGuard';
import { TypographyH1, TypographyH2 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	LineChart,
	Users,
	Eye,
	MousePointer,
	Globe,
	Monitor,
	Smartphone,
	Download,
	RefreshCcw,
	ExternalLink,
} from 'lucide-react';
import { analyticsApi } from '@/lib/api/analytics';

export default function AnalyticsPage() {
	const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>(
		'30d'
	);
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);

	// Fetch analytics data
	useEffect(() => {
		const fetchAnalytics = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// Use the real API call
				const analyticsData = await analyticsApi.getAnalyticsData(
					timeRange
				);
				setData(analyticsData);
			} catch (error) {
				console.error('Error fetching analytics:', error);
				setError('Failed to load analytics data');

				// Fall back to mock data for development
				if (process.env.NODE_ENV === 'development') {
					console.log('Using mock data as fallback');
					setData(generateMockData(timeRange));
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalytics();
	}, [timeRange]);

	// Generate mock data for testing
	const generateMockData = (range: string) => {
		const now = new Date();

		const trafficMultiplier =
			range === '7d'
				? 1
				: range === '30d'
				? 0.8
				: range === '90d'
				? 0.7
				: 0.6;
		const dayCount =
			range === '7d'
				? 7
				: range === '30d'
				? 30
				: range === '90d'
				? 90
				: 365;

		const dailyTraffic = Array.from({ length: dayCount }, (_, i) => {
			const date = new Date(now);
			date.setDate(date.getDate() - (dayCount - i - 1));

			const dayOfWeek = date.getDay();
			const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
			const baseVisits = isWeekend ? 150 : 300;

			return {
				date: date.toISOString().split('T')[0],
				visits: Math.floor(
					baseVisits * trafficMultiplier * (0.7 + Math.random() * 0.6)
				),
				uniqueVisitors: Math.floor(
					baseVisits *
						trafficMultiplier *
						0.6 *
						(0.7 + Math.random() * 0.6)
				),
				pageViews: Math.floor(
					baseVisits *
						trafficMultiplier *
						1.8 *
						(0.7 + Math.random() * 0.6)
				),
			};
		});

		const totalVisits = dailyTraffic.reduce(
			(sum, day) => sum + day.visits,
			0
		);
		const totalUniqueVisitors = dailyTraffic.reduce(
			(sum, day) => sum + day.uniqueVisitors,
			0
		);
		const totalPageViews = dailyTraffic.reduce(
			(sum, day) => sum + day.pageViews,
			0
		);

		const averageVisitsPerDay = Math.round(totalVisits / dayCount);
		const averageUniqueVisitorsPerDay = Math.round(
			totalUniqueVisitors / dayCount
		);
		const averagePageViewsPerDay = Math.round(totalPageViews / dayCount);

		const engagementRate = 0.45 + Math.random() * 0.2;
		const avgSessionDuration = 120 + Math.round(Math.random() * 180);
		const bounceRate = 0.3 + Math.random() * 0.2;

		const prevPeriodVisits = Math.round(
			totalVisits * (0.8 + Math.random() * 0.4)
		);
		const visitsDiff = totalVisits - prevPeriodVisits;
		const visitsDiffPercent = Math.round(
			(visitsDiff / prevPeriodVisits) * 100
		);

		const topPages = [
			{
				page: 'Home',
				views: Math.round(totalPageViews * 0.32),
				avgTimeOnPage: 45 + Math.round(Math.random() * 30),
			},
			{
				page: 'Portfolio',
				views: Math.round(totalPageViews * 0.21),
				avgTimeOnPage: 70 + Math.round(Math.random() * 50),
			},
			{
				page: 'Say What Up Doe',
				views: Math.round(totalPageViews * 0.18),
				avgTimeOnPage: 125 + Math.round(Math.random() * 60),
			},
			{
				page: 'Merch',
				views: Math.round(totalPageViews * 0.12),
				avgTimeOnPage: 90 + Math.round(Math.random() * 45),
			},
			{
				page: 'Login',
				views: Math.round(totalPageViews * 0.09),
				avgTimeOnPage: 30 + Math.round(Math.random() * 20),
			},
			{
				page: 'Signup',
				views: Math.round(totalPageViews * 0.08),
				avgTimeOnPage: 65 + Math.round(Math.random() * 30),
			},
		];

		const devices = {
			desktop: Math.round(totalVisits * (0.45 + Math.random() * 0.15)),
			mobile: Math.round(totalVisits * (0.4 + Math.random() * 0.15)),
			tablet: Math.round(totalVisits * (0.05 + Math.random() * 0.05)),
		};

		const locations = [
			{ region: 'Detroit', visits: Math.round(totalVisits * 0.42) },
			{ region: 'Ann Arbor', visits: Math.round(totalVisits * 0.13) },
			{ region: 'Grand Rapids', visits: Math.round(totalVisits * 0.11) },
			{ region: 'Lansing', visits: Math.round(totalVisits * 0.08) },
			{
				region: 'Other Michigan',
				visits: Math.round(totalVisits * 0.15),
			},
			{ region: 'Out of State', visits: Math.round(totalVisits * 0.11) },
		];

		return {
			timeRange: range,
			dailyTraffic,
			totals: {
				visits: totalVisits,
				uniqueVisitors: totalUniqueVisitors,
				pageViews: totalPageViews,
				visitsDiff,
				visitsDiffPercent,
			},
			averages: {
				visitsPerDay: averageVisitsPerDay,
				uniqueVisitorsPerDay: averageUniqueVisitorsPerDay,
				pageViewsPerDay: averagePageViewsPerDay,
			},
			engagement: {
				engagementRate,
				avgSessionDuration,
				bounceRate,
			},
			topPages,
			devices,
			locations,
		};
	};

	const formatNumber = (num: number | null | undefined) => {
		if (num === null || num === undefined) return '0';
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	return (
		<AdminGuard>
			<div className='container mx-auto px-4 py-8'>
				<div className='mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div>
						<TypographyH1>Analytics Dashboard</TypographyH1>
						<p className='text-muted-foreground'>
							Track site performance and user engagement
						</p>
					</div>

					<div className='flex items-center gap-3'>
						<div className='bg-card rounded-md p-1 border border-border flex'>
							<Button
								variant={
									timeRange === '7d' ? 'default' : 'ghost'
								}
								size='sm'
								className='rounded-sm'
								onClick={() => setTimeRange('7d')}
							>
								7 Days
							</Button>
							<Button
								variant={
									timeRange === '30d' ? 'default' : 'ghost'
								}
								size='sm'
								className='rounded-sm'
								onClick={() => setTimeRange('30d')}
							>
								30 Days
							</Button>
							<Button
								variant={
									timeRange === '90d' ? 'default' : 'ghost'
								}
								size='sm'
								className='rounded-sm'
								onClick={() => setTimeRange('90d')}
							>
								90 Days
							</Button>
							<Button
								variant={
									timeRange === 'all' ? 'default' : 'ghost'
								}
								size='sm'
								className='rounded-sm'
								onClick={() => setTimeRange('all')}
							>
								All Time
							</Button>
						</div>

						<Button
							variant='outline'
							size='sm'
							className='flex items-center gap-1'
							onClick={() => {
								setIsLoading(true);
								setTimeout(() => {
									setData(generateMockData(timeRange));
									setIsLoading(false);
								}, 800);
							}}
						>
							<RefreshCcw size={14} />
							Refresh
						</Button>

						<Button
							variant='outline'
							onClick={async () => {
								try {
									// Fetch a simple status endpoint to check if analytics is working
									const baseUrl =
										process.env.NEXT_PUBLIC_API_URL ||
										'http://localhost:3001/api';
									const response = await fetch(
										`${baseUrl.replace(
											'/api',
											''
										)}/analytics/status`
									);
									const data = await response.json();
									alert(
										`Analytics status: ${JSON.stringify(
											data
										)}`
									);
								} catch (error) {
									alert(`Analytics error: ${error.message}`);
								}
							}}
						>
							Check Analytics Status
						</Button>
					</div>
				</div>

				<div className='mb-8 bg-blue-50 p-4 border border-blue-200 rounded-lg'>
					<div className='flex items-center justify-between'>
						<div>
							<h3 className='text-lg font-semibold text-blue-700'>
								Google Analytics
							</h3>
							<p className='text-blue-600'>
								Access advanced analytics insights through your
								Google Analytics dashboard
							</p>
						</div>
						<Button
							className='bg-blue-600 hover:bg-blue-700 text-white'
							onClick={() =>
								window.open(
									'https://analytics.google.com/analytics/web/#/p345875488/reports/dashboard',
									'_blank'
								)
							}
						>
							<ExternalLink
								size={16}
								className='mr-2'
							/>
							Open Google Analytics
						</Button>
					</div>
				</div>

				{isLoading ? (
					<div className='flex justify-center items-center h-64'>
						<div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full'></div>
					</div>
				) : data && data.totals ? (
					<>
						<section className='mb-8'>
							<TypographyH2 className='mb-4'>
								Overview
							</TypographyH2>
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
								<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
									<div className='flex items-start justify-between'>
										<div>
											<p className='text-muted-foreground text-sm'>
												Total Visits
											</p>
											<p className='text-3xl font-bold mt-2'>
												{formatNumber(
													data.totals.visits
												)}
											</p>
										</div>
										<div
											className={cn(
												'px-2 py-1 rounded-full text-xs font-medium flex items-center',
												data.totals.visitsDiffPercent >=
													0
													? 'bg-green-100 text-green-800'
													: 'bg-red-100 text-red-800'
											)}
										>
											{data.totals.visitsDiffPercent}%
										</div>
									</div>
									<p className='text-xs text-muted-foreground mt-2'>
										vs previous period
									</p>
								</div>

								<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
									<div className='flex items-start justify-between'>
										<div>
											<p className='text-muted-foreground text-sm'>
												Unique Visitors
											</p>
											<p className='text-3xl font-bold mt-2'>
												{formatNumber(
													data.totals.uniqueVisitors
												)}
											</p>
										</div>
										<Users
											className='text-muted-foreground'
											size={20}
										/>
									</div>
									<p className='text-xs text-muted-foreground mt-2'>
										{formatNumber(
											data.averages.uniqueVisitorsPerDay
										)}{' '}
										per day
									</p>
								</div>

								<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
									<div className='flex items-start justify-between'>
										<div>
											<p className='text-muted-foreground text-sm'>
												Page Views
											</p>
											<p className='text-3xl font-bold mt-2'>
												{formatNumber(
													data.totals.pageViews
												)}
											</p>
										</div>
										<Eye
											className='text-muted-foreground'
											size={20}
										/>
									</div>
									<p className='text-xs text-muted-foreground mt-2'>
										{formatNumber(
											data.averages.pageViewsPerDay
										)}{' '}
										per day
									</p>
								</div>

								<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
									<div className='flex items-start justify-between'>
										<div>
											<p className='text-muted-foreground text-sm'>
												Bounce Rate
											</p>
											<p className='text-3xl font-bold mt-2'>
												{(
													data.engagement.bounceRate *
													100
												).toFixed(1)}
												%
											</p>
										</div>
										<MousePointer
											className='text-muted-foreground'
											size={20}
										/>
									</div>
									<p className='text-xs text-muted-foreground mt-2'>
										Users who leave after one page
									</p>
								</div>
							</div>
						</section>

						<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
							<section>
								<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
									<TypographyH2 className='mb-6'>
										Devices
									</TypographyH2>
									<div className='space-y-4'>
										<div className='flex items-center justify-between'>
											<div className='flex items-center'>
												<Monitor
													size={16}
													className='mr-2 text-primary'
												/>
												<span>Desktop</span>
											</div>
											<div className='flex items-center'>
												<span className='mr-2'>
													{formatNumber(
														data.devices.desktop
													)}
												</span>
												<span className='text-muted-foreground text-sm'>
													{Math.round(
														(data.devices.desktop /
															data.totals
																.visits) *
															100
													)}
													%
												</span>
											</div>
										</div>

										<div className='flex items-center justify-between'>
											<div className='flex items-center'>
												<Smartphone
													size={16}
													className='mr-2 text-secondary'
												/>
												<span>Mobile</span>
											</div>
											<div className='flex items-center'>
												<span className='mr-2'>
													{formatNumber(
														data.devices.mobile
													)}
												</span>
												<span className='text-muted-foreground text-sm'>
													{Math.round(
														(data.devices.mobile /
															data.totals
																.visits) *
															100
													)}
													%
												</span>
											</div>
										</div>

										<div className='flex items-center justify-between'>
											<div className='flex items-center'>
												<Tablet
													size={16}
													className='mr-2 text-accent'
												/>
												<span>Tablet</span>
											</div>
											<div className='flex items-center'>
												<span className='mr-2'>
													{formatNumber(
														data.devices.tablet
													)}
												</span>
												<span className='text-muted-foreground text-sm'>
													{Math.round(
														(data.devices.tablet /
															data.totals
																.visits) *
															100
													)}
													%
												</span>
											</div>
										</div>
									</div>
								</div>
							</section>

							<section>
								<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
									<TypographyH2 className='mb-6'>
										Top Pages
									</TypographyH2>
									<div className='overflow-x-auto'>
										<table className='w-full'>
											<thead>
												<tr className='text-left border-b border-border'>
													<th className='pb-2 font-medium text-muted-foreground'>
														Page
													</th>
													<th className='pb-2 font-medium text-muted-foreground'>
														Views
													</th>
												</tr>
											</thead>
											<tbody>
												{data.topPages.slice(0, 5).map(
													(
														page: {
															page: string;
															views: number;
														},
														i: number
													) => (
														<tr
															key={i}
															className='border-b border-border/50 last:border-0'
														>
															<td className='py-3'>
																/
																{page.page
																	.toLowerCase()
																	.replace(
																		/\s+/g,
																		'-'
																	)}
															</td>
															<td className='py-3'>
																{formatNumber(
																	page.views
																)}
															</td>
														</tr>
													)
												)}
											</tbody>
										</table>
									</div>
								</div>
							</section>
						</div>

						<section>
							<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
								<TypographyH2 className='mb-6'>
									Geographic Distribution
								</TypographyH2>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div>
										<p className='text-sm font-medium mb-3'>
											Top Locations
										</p>
										{data.locations.map(
											(
												location: {
													region: string;
													visits: number;
												},
												i: number
											) => {
												const percentage =
													(location.visits /
														data.totals.visits) *
													100;
												return (
													<div
														key={i}
														className='mb-4'
													>
														<div className='flex justify-between items-center mb-1'>
															<span>
																{
																	location.region
																}
															</span>
															<span className='text-sm text-muted-foreground'>
																{percentage.toFixed(
																	1
																)}
																%
															</span>
														</div>
														<div className='h-2 bg-muted/30 rounded-full overflow-hidden'>
															<div
																className={cn(
																	'h-full',
																	i === 0
																		? 'bg-primary'
																		: i ===
																		  1
																		? 'bg-secondary'
																		: i ===
																		  2
																		? 'bg-accent'
																		: 'bg-muted'
																)}
																style={{
																	width: `${percentage}%`,
																}}
															></div>
														</div>
													</div>
												);
											}
										)}
									</div>
									<div className='flex items-center justify-center'>
										<div className='text-center'>
											<Globe
												size={80}
												className='mx-auto text-muted-foreground mb-4'
											/>
											<p className='text-muted-foreground'>
												For detailed geographic
												insights, check Google Analytics
											</p>
										</div>
									</div>
								</div>
							</div>
						</section>
					</>
				) : (
					<div className='p-8 text-center'>
						<p>No analytics data available.</p>
					</div>
				)}
			</div>
		</AdminGuard>
	);
}

function Tablet(props: any) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}
		>
			<rect
				width='16'
				height='20'
				x='4'
				y='2'
				rx='2'
				ry='2'
			/>
			<line
				x1='12'
				x2='12.01'
				y1='18'
				y2='18'
			/>
		</svg>
	);
}
