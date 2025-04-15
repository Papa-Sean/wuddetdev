'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/guards/AdminGuard';
import { TypographyH1, TypographyH2 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	LineChart,
	BarChart,
	PieChart,
	Calendar,
	ArrowUp,
	ArrowDown,
	Users,
	Eye,
	MessageSquare,
	MousePointer,
	Globe,
	Monitor,
	Smartphone,
	Download,
	RefreshCcw,
} from 'lucide-react';

export default function AnalyticsPage() {
	const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>(
		'30d'
	);
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<any>(null);

	// Fetch analytics data
	useEffect(() => {
		const fetchAnalytics = async () => {
			setIsLoading(true);
			try {
				// In production, you would fetch real data from your API
				// const response = await fetch('/api/admin/analytics?timeRange=' + timeRange);
				// const result = await response.json();

				// For development/testing, generate mock data
				setTimeout(() => {
					setData(generateMockData(timeRange));
					setIsLoading(false);
				}, 800);
			} catch (error) {
				console.error('Error fetching analytics:', error);
				setIsLoading(false);
			}
		};

		fetchAnalytics();
	}, [timeRange]);

	// Generate mock data for testing
	const generateMockData = (range: string) => {
		const now = new Date();

		// Traffic data with different patterns based on time range
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

			// Create some patterns in the data
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

		// Calculate totals and averages
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

		// User engagement metrics
		const engagementRate = 0.45 + Math.random() * 0.2; // 45-65%
		const avgSessionDuration = 120 + Math.round(Math.random() * 180); // 2-5 minutes
		const bounceRate = 0.3 + Math.random() * 0.2; // 30-50%

		// Compare to previous period
		const prevPeriodVisits = Math.round(
			totalVisits * (0.8 + Math.random() * 0.4)
		);
		const visitsDiff = totalVisits - prevPeriodVisits;
		const visitsDiffPercent = Math.round(
			(visitsDiff / prevPeriodVisits) * 100
		);

		// Generate page data
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

		// Device data
		const devices = {
			desktop: Math.round(totalVisits * (0.45 + Math.random() * 0.15)),
			mobile: Math.round(totalVisits * (0.4 + Math.random() * 0.15)),
			tablet: Math.round(totalVisits * (0.05 + Math.random() * 0.05)),
		};

		// Geographic data
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

	// Format number with commas
	const formatNumber = (num: number) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	// Format time in MM:SS
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	return (
		<AdminGuard>
			<div className='container mx-auto px-4 py-8'>
				<div className='mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div>
						<TypographyH1>Analytics Dashboard</TypographyH1>
						<p className='text-muted-foreground'>
							Track site performance and user engagement
						</p>
					</div>

					<div className='flex flex-wrap items-center gap-3'>
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
							size='sm'
							className='flex items-center gap-1'
						>
							<Download size={14} />
							Export
						</Button>
					</div>
				</div>

				{isLoading ? (
					<div className='flex justify-center items-center h-64'>
						<div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full'></div>
					</div>
				) : data ? (
					<>
						{/* Overview Stats */}
						<section className='mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
							<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
								<div className='flex items-start justify-between'>
									<div>
										<p className='text-muted-foreground text-sm'>
											Total Visits
										</p>
										<p className='text-3xl font-bold mt-2'>
											{formatNumber(data.totals.visits)}
										</p>
									</div>
									<div
										className={cn(
											'px-2 py-1 rounded-full text-xs font-medium flex items-center',
											data.totals.visitsDiffPercent >= 0
												? 'bg-green-100 text-green-800'
												: 'bg-red-100 text-red-800'
										)}
									>
										{data.totals.visitsDiffPercent >= 0 ? (
											<ArrowUp
												size={12}
												className='mr-1'
											/>
										) : (
											<ArrowDown
												size={12}
												className='mr-1'
											/>
										)}
										{Math.abs(
											data.totals.visitsDiffPercent
										)}
										%
									</div>
								</div>
								<p className='text-xs text-muted-foreground mt-2'>
									vs previous period
								</p>
								<div className='mt-4 h-10 bg-muted/30 rounded-md relative overflow-hidden'>
									<div
										className='absolute inset-y-0 left-0 bg-primary/20'
										style={{ width: '70%' }}
									></div>
								</div>
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
								<div className='mt-4 h-10 bg-muted/30 rounded-md relative overflow-hidden'>
									<div
										className='absolute inset-y-0 left-0 bg-secondary/20'
										style={{ width: '60%' }}
									></div>
								</div>
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
								<div className='mt-4 h-10 bg-muted/30 rounded-md relative overflow-hidden'>
									<div
										className='absolute inset-y-0 left-0 bg-accent/20'
										style={{ width: '82%' }}
									></div>
								</div>
							</div>

							<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
								<div className='flex items-start justify-between'>
									<div>
										<p className='text-muted-foreground text-sm'>
											Bounce Rate
										</p>
										<p className='text-3xl font-bold mt-2'>
											{(
												data.engagement.bounceRate * 100
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
								<div className='mt-4 h-10 bg-muted/30 rounded-md relative overflow-hidden'>
									<div
										className='absolute inset-y-0 left-0 bg-red-200'
										style={{
											width: `${
												data.engagement.bounceRate * 100
											}%`,
										}}
									></div>
								</div>
							</div>
						</section>

						{/* Traffic Chart */}
						<section className='mb-8'>
							<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
								<div className='flex items-center justify-between mb-6'>
									<TypographyH2>
										Traffic Overview
									</TypographyH2>
									<div>
										<Button
											variant='outline'
											size='sm'
											className='text-xs'
										>
											<LineChart
												size={14}
												className='mr-1'
											/>{' '}
											Line
										</Button>
									</div>
								</div>

								<div className='h-80 w-full'>
									{/* This would be where you integrate your preferred charting library */}
									<div className='h-full w-full bg-muted/20 rounded-md flex items-center justify-center'>
										<div className='text-center'>
											<LineChart
												size={48}
												className='mx-auto text-muted-foreground mb-4'
											/>
											<p className='text-muted-foreground'>
												Traffic chart would render here
												with data from{' '}
												{data.dailyTraffic.length} days
											</p>
											<p className='text-xs text-muted-foreground mt-2'>
												Integrate with your preferred
												charting library (Chart.js,
												Recharts, etc.)
											</p>
										</div>
									</div>
								</div>
							</div>
						</section>

						{/* Two Column Stats */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
							{/* User Engagement */}
							<section>
								<div className='bg-card p-6 rounded-lg shadow-sm border border-border h-full'>
									<TypographyH2 className='mb-6'>
										User Engagement
									</TypographyH2>

									<div className='space-y-6'>
										<div className='flex items-center justify-between'>
											<div>
												<p className='text-sm text-muted-foreground'>
													Engagement Rate
												</p>
												<p className='text-2xl font-semibold mt-1'>
													{(
														data.engagement
															.engagementRate *
														100
													).toFixed(1)}
													%
												</p>
											</div>
											<div className='w-24 h-24 rounded-full border-8 border-primary/20 relative'>
												<div
													className='absolute inset-0 rounded-full overflow-hidden'
													style={{
														clipPath: `polygon(50% 50%, 50% 0, ${
															50 +
															50 *
																Math.sin(
																	data
																		.engagement
																		.engagementRate *
																		2 *
																		Math.PI
																)
														}% ${
															50 -
															50 *
																Math.cos(
																	data
																		.engagement
																		.engagementRate *
																		2 *
																		Math.PI
																)
														}%, 50% 50%)`,
													}}
												>
													<div className='w-full h-full bg-primary/20'></div>
												</div>
												<div className='absolute inset-0 flex items-center justify-center'>
													<span className='text-sm font-medium'>
														{(
															data.engagement
																.engagementRate *
															100
														).toFixed(0)}
														%
													</span>
												</div>
											</div>
										</div>

										<div className='grid grid-cols-2 gap-4'>
											<div className='bg-muted/20 p-4 rounded-md'>
												<p className='text-sm text-muted-foreground'>
													Avg. Session
												</p>
												<p className='text-xl font-semibold mt-1'>
													{formatTime(
														data.engagement
															.avgSessionDuration
													)}
												</p>
												<p className='text-xs text-muted-foreground mt-1'>
													Minutes:Seconds
												</p>
											</div>
											<div className='bg-muted/20 p-4 rounded-md'>
												<p className='text-sm text-muted-foreground'>
													Pages/Session
												</p>
												<p className='text-xl font-semibold mt-1'>
													{(
														data.totals.pageViews /
														data.totals.visits
													).toFixed(1)}
												</p>
												<p className='text-xs text-muted-foreground mt-1'>
													Average
												</p>
											</div>
										</div>

										<div>
											<p className='text-sm font-medium mb-2'>
												Session Quality
											</p>
											<div className='h-2 bg-muted/30 rounded-full overflow-hidden'>
												<div
													className='h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500'
													style={{
														width: `${
															(1 -
																data.engagement
																	.bounceRate) *
															100
														}%`,
													}}
												></div>
											</div>
										</div>
									</div>
								</div>
							</section>

							{/* Top Content */}
							<section>
								<div className='bg-card p-6 rounded-lg shadow-sm border border-border h-full'>
									<TypographyH2 className='mb-6'>
										Top Content
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
													<th className='pb-2 font-medium text-muted-foreground'>
														Avg. Time
													</th>
												</tr>
											</thead>
											<tbody>
												{data.topPages.map(
													(page, i) => (
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
															<td className='py-3'>
																{formatTime(
																	page.avgTimeOnPage
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

						{/* Bottom Section - Geography and Devices */}
						<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
							{/* Device Stats */}
							<section className='lg:col-span-1'>
								<div className='bg-card p-6 rounded-lg shadow-sm border border-border h-full'>
									<TypographyH2 className='mb-6'>
										Devices
									</TypographyH2>

									<div className='h-48 w-full mb-6'>
										{/* This would be where you integrate your preferred charting library */}
										<div className='h-full w-full flex items-center justify-center relative'>
											<PieChart
												size={48}
												className='mx-auto text-muted-foreground absolute'
											/>
											<div className='w-32 h-32 rounded-full border-8 border-muted/30'></div>
										</div>
									</div>

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

							{/* Geographic Stats */}
							<section className='lg:col-span-2'>
								<div className='bg-card p-6 rounded-lg shadow-sm border border-border h-full'>
									<TypographyH2 className='mb-6'>
										Geographic Distribution
									</TypographyH2>

									<div className='grid grid-cols-1 md:grid-cols-2 gap-6 h-full'>
										<div className='h-full flex items-center justify-center'>
											<div className='text-center'>
												<Globe
													size={80}
													className='mx-auto text-muted-foreground mb-4'
												/>
												<p className='text-muted-foreground'>
													Interactive map would render
													here
												</p>
											</div>
										</div>

										<div>
											<p className='text-sm font-medium mb-3'>
												Top Locations
											</p>

											{data.locations.map(
												(location, i) => {
													const percentage =
														(location.visits /
															data.totals
																.visits) *
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
									</div>
								</div>
							</section>
						</div>
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

// Helper components for the missing icons
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
