import { TypographyH2 } from '@/components/ui/typography';
import { LocationData } from '../types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface GeographicSectionProps {
	locations: LocationData[];
	totalVisits: number;
}

export function GeographicSection({
	locations,
	totalVisits,
}: GeographicSectionProps) {
	// Add null check for locations array
	if (!locations || !Array.isArray(locations)) {
		return (
			<section>
				<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
					<TypographyH2 className='mb-6'>
						Michigan Visitor Distribution
					</TypographyH2>
					<p className='text-muted-foreground text-center py-8'>
						No location data available
					</p>
				</div>
			</section>
		);
	}

	// Filter only Michigan locations with proper null checks
	const michiganData = locations
		.filter(
			(location) =>
				location.state === 'MI' ||
				(location.city && location.city.includes('Michigan')) ||
				(location.region && location.region.includes('Michigan'))
		)
		.sort((a, b) => b.visits - a.visits)
		.slice(0, 5);

	return (
		<section>
			<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
				<TypographyH2 className='mb-6'>
					Michigan Visitor Distribution
				</TypographyH2>
				<div className='grid grid-cols-1 gap-6'>
					<div>
						<div className='flex justify-between items-center mb-3'>
							<p className='text-sm font-medium'>
								Top Michigan Locations
							</p>
						</div>

						{michiganData.length === 0 && (
							<p className='text-muted-foreground text-center py-4'>
								No Michigan visitor data available
							</p>
						)}

						{michiganData.map((location, i) => {
							const percentage =
								(location.visits / totalVisits) * 100;
							return (
								<div
									key={i}
									className='mb-4'
								>
									<div className='flex justify-between items-center mb-1'>
										<span className='flex items-center'>
											{location.region ||
												'Unknown Region'}
										</span>
										<span className='text-sm text-muted-foreground'>
											{percentage.toFixed(1)}%
										</span>
									</div>
									<div className='h-2 bg-muted/30 rounded-full overflow-hidden'>
										<div
											className={cn(
												'h-full',
												i === 0
													? 'bg-primary'
													: i === 1
													? 'bg-secondary'
													: i === 2
													? 'bg-accent'
													: 'bg-muted'
											)}
											style={{ width: `${percentage}%` }}
										></div>
									</div>
								</div>
							);
						})}

						{/* Michigan visitor locations table */}
						<div className='mt-6 border border-border rounded-md overflow-hidden'>
							<table className='w-full text-sm'>
								<thead className='bg-muted/50'>
									<tr>
										<th className='text-left p-2 font-medium'>
											Location
										</th>
										<th className='text-right p-2 font-medium'>
											Visits
										</th>
										<th className='text-right p-2 font-medium'>
											% of Total
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-border'>
									{michiganData.length === 0 && (
										<tr>
											<td
												colSpan={3}
												className='p-4 text-center text-muted-foreground'
											>
												No Michigan visit data available
											</td>
										</tr>
									)}
									{michiganData.map((location, i) => {
										const percentage =
											(location.visits / totalVisits) *
											100;
										return (
											<tr
												key={i}
												className={
													i % 2 === 0
														? 'bg-muted/10'
														: ''
												}
											>
												<td className='p-2'>
													<div className='flex items-center'>
														<div
															className={cn(
																'w-2 h-2 rounded-full mr-2',
																i === 0
																	? 'bg-primary'
																	: i === 1
																	? 'bg-secondary'
																	: i === 2
																	? 'bg-accent'
																	: 'bg-muted'
															)}
														></div>
														{location.region ||
															'Unknown Region'}
													</div>
												</td>
												<td className='p-2 text-right'>
													{location.visits}
												</td>
												<td className='p-2 text-right'>
													{percentage.toFixed(1)}%
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div className='text-center mt-4'>
					<p className='text-xs text-muted-foreground'>
						Based on {totalVisits} total visits • Showing Michigan
						data only
					</p>
				</div>
			</div>
		</section>
	);
}
