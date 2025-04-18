import { TypographyH2 } from '@/components/ui/typography';
import { formatNumber } from './utils/formatters';
import { PageData } from '../types';

interface TopPagesSectionProps {
	pages: PageData[];
}

export function TopPagesSection({ pages }: TopPagesSectionProps) {
	return (
		<div className='bg-card p-6 rounded-lg shadow-sm border border-border h-full'>
			<TypographyH2 className='mb-6'>Top Pages</TypographyH2>
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
						{pages.slice(0, 5).map((page, i) => (
							<tr
								key={i}
								className='border-b border-border/50 last:border-0'
							>
								<td className='py-3'>
									/
									{page.page
										.toLowerCase()
										.replace(/\s+/g, '-')}
								</td>
								<td className='py-3'>
									{formatNumber(page.views)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
