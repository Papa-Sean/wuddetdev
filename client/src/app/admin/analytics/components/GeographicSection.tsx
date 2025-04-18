import { TypographyH2 } from '@/components/ui/typography';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocationData } from '../types';

interface GeographicSectionProps {
	locations: LocationData[];
	totalVisits: number;
	gaGeoData?: {
		locations: Array<{ region: string; country: string; visits: number }>;
		totalVisits: number;
	} | null;
	isLoadingGa?: boolean;
}

export function GeographicSection({
	locations,
	totalVisits,
	gaGeoData,
	isLoadingGa = false,
}: GeographicSectionProps) {
	// Determine which data to use - GA if available, otherwise custom data
	const useGaData = gaGeoData && !isLoadingGa;
	const displayLocations = useGaData ? gaGeoData.locations : locations;
	const displayTotal = useGaData ? gaGeoData.totalVisits : totalVisits;

	return (
		<section>
			<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
				<TypographyH2 className='mb-6'>
					Geographic Distribution
				</TypographyH2>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div>
						<div className='flex justify-between items-center mb-3'>
							<p className='text-sm font-medium'>Top Locations</p>
							{useGaData && (
								<span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
									Google Analytics
								</span>
							)}
						</div>

						{isLoadingGa ? (
							<div className='flex justify-center items-center h-32'>
								<div className='animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full'></div>
							</div>
						) : (
							displayLocations.map((location, i) => {
								const percentage =
									(location.visits / displayTotal) * 100;
								return (
									<div
										key={i}
										className='mb-4'
									>
										<div className='flex justify-between items-center mb-1'>
											<span className='flex items-center'>
												{location.region}
												{useGaData &&
													location.country !==
														'United States' && (
														<span className='ml-1 text-xs text-muted-foreground'>
															({location.country})
														</span>
													)}
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
												style={{
													width: `${percentage}%`,
												}}
											></div>
										</div>
									</div>
								);
							})
						)}
					</div>

					<div className='flex items-center justify-center'>
						<div className='text-center'>
							<Globe
								size={80}
								className='mx-auto text-muted-foreground mb-4'
							/>
							{useGaData ? (
								<div className='max-w-xs mx-auto'>
									<p className='text-secondary font-medium'>
										Showing real visitor data from Google
										Analytics
									</p>
									<p className='text-xs text-muted-foreground mt-2'>
										Data from last 30 days • {displayTotal}{' '}
										total visits
									</p>
								</div>
							) : (
								<p className='text-muted-foreground'>
									For detailed geographic insights, check
									Google Analytics
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
