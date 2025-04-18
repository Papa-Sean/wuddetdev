import { cn } from '@/lib/utils';

interface StatCardProps {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	subtext: string;
	badge?: {
		value: string;
		positive: boolean;
	};
}

export function StatCard({
	title,
	value,
	icon,
	subtext,
	badge,
}: StatCardProps) {
	return (
		<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
			<div className='flex items-start justify-between'>
				<div>
					<p className='text-muted-foreground text-sm'>{title}</p>
					<p className='text-3xl font-bold mt-2'>{value}</p>
				</div>
				{badge ? (
					<div
						className={cn(
							'px-2 py-1 rounded-full text-xs font-medium flex items-center',
							badge.positive
								? 'bg-green-100 text-green-800'
								: 'bg-red-100 text-red-800'
						)}
					>
						{badge.value}
					</div>
				) : (
					icon
				)}
			</div>
			<p className='text-xs text-muted-foreground mt-2'>{subtext}</p>
		</div>
	);
}
