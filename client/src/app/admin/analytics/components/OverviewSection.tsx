import { TypographyH2 } from '@/components/ui/typography';
import { Users, Eye, MousePointer } from 'lucide-react';
import { StatCard } from './shared/StatCard';
import { formatNumber } from './utils/formatters';
import { AnalyticsData } from '../types';

interface OverviewSectionProps {
	data: AnalyticsData;
}

export function OverviewSection({ data }: OverviewSectionProps) {
	return (
		<section className='mb-8'>
			<TypographyH2 className='mb-4'>Overview</TypographyH2>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				<StatCard
					title='Total Visits'
					value={formatNumber(data.totals.visits)}
					icon={<></>}
					badge={{
						value: `${data.totals.visitsDiffPercent}%`,
						positive: data.totals.visitsDiffPercent >= 0,
					}}
					subtext='vs previous period'
				/>

				<StatCard
					title='Unique Visitors'
					value={formatNumber(data.totals.uniqueVisitors)}
					icon={
						<Users
							className='text-muted-foreground'
							size={20}
						/>
					}
					subtext={`${formatNumber(
						data.averages.uniqueVisitorsPerDay
					)} per day`}
				/>

				<StatCard
					title='Page Views'
					value={formatNumber(data.totals.pageViews)}
					icon={
						<Eye
							className='text-muted-foreground'
							size={20}
						/>
					}
					subtext={`${formatNumber(
						data.averages.pageViewsPerDay
					)} per day`}
				/>

				<StatCard
					title='Bounce Rate'
					value={`${(data.engagement.bounceRate * 100).toFixed(1)}%`}
					icon={
						<MousePointer
							className='text-muted-foreground'
							size={20}
						/>
					}
					subtext='Users who leave after one page'
				/>
			</div>
		</section>
	);
}
