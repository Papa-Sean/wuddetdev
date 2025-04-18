'use client';

import { AdminGuard } from '@/components/guards/AdminGuard';
import useAnalyticsData from './hooks/useAnalyticsData';
import { AnalyticsHeader } from './components/AnalyticsHeader';
import { OverviewSection } from './components/OverviewSection';
import { DevicesSection } from './components/DevicesSection';
import { TopPagesSection } from './components/TopPagesSection';
import { GeographicSection } from './components/GeographicSection';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { EmptyState } from './components/shared/EmptyState';

export default function AnalyticsPage() {
	const {
		data,
		isLoading,
		error,
		timeRange,
		setTimeRange,
		refreshData,
		checkStatus,
	} = useAnalyticsData('30d');

	const handleCheckStatus = async () => {
		try {
			const data = await checkStatus();
			alert(`Analytics status: ${JSON.stringify(data, null, 2)}`);
		} catch (error) {
			alert(
				`Analytics error: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	};

	return (
		<AdminGuard>
			<div className='container mx-auto px-4 py-8'>
				<AnalyticsHeader
					timeRange={timeRange}
					setTimeRange={setTimeRange}
					onRefresh={refreshData}
					onCheckStatus={handleCheckStatus}
				/>

				{isLoading ? (
					<LoadingSpinner />
				) : data ? (
					<>
						<OverviewSection data={data} />

						<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
							<DevicesSection
								devices={data.devices}
								totalVisits={data.totals.visits}
							/>

							<TopPagesSection pages={data.topPages} />
						</div>

						<GeographicSection
							locations={data.locations}
							totalVisits={data.totals.visits}
						/>
					</>
				) : (
					<EmptyState />
				)}
			</div>
		</AdminGuard>
	);
}
