import { Button } from '@/components/ui/button';
import { TypographyH1 } from '@/components/ui/typography';
import { RefreshCcw } from 'lucide-react';
import { TimeRange } from '../types';

interface AnalyticsHeaderProps {
	timeRange: TimeRange;
	setTimeRange: (range: TimeRange) => void;
	onRefresh: () => void;
	onCheckStatus: () => void;
}

export function AnalyticsHeader({
	timeRange,
	setTimeRange,
	onRefresh,
	onCheckStatus,
}: AnalyticsHeaderProps) {
	return (
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
						variant={timeRange === '7d' ? 'default' : 'ghost'}
						size='sm'
						className='rounded-sm'
						onClick={() => setTimeRange('7d')}
					>
						7 Days
					</Button>
					<Button
						variant={timeRange === '30d' ? 'default' : 'ghost'}
						size='sm'
						className='rounded-sm'
						onClick={() => setTimeRange('30d')}
					>
						30 Days
					</Button>
					<Button
						variant={timeRange === '90d' ? 'default' : 'ghost'}
						size='sm'
						className='rounded-sm'
						onClick={() => setTimeRange('90d')}
					>
						90 Days
					</Button>
					<Button
						variant={timeRange === 'all' ? 'default' : 'ghost'}
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
					onClick={onRefresh}
				>
					<RefreshCcw size={14} />
					<span className='hidden sm:inline'>Refresh</span>
				</Button>

				<Button
					variant='outline'
					size='sm'
					onClick={onCheckStatus}
					className='hidden sm:flex items-center gap-1'
				>
					Check Status
				</Button>
			</div>
		</div>
	);
}
