import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function GoogleAnalyticsCard() {
	return (
		<div className='mb-8 bg-blue-50 p-4 border border-blue-200 rounded-lg'>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h3 className='text-lg font-semibold text-blue-700'>
						Google Analytics
					</h3>
					<p className='text-blue-600'>
						Access advanced analytics insights through your Google
						Analytics dashboard
					</p>
				</div>
				<Button
					className='bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto'
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
	);
}
