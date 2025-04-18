import { TypographyH2 } from '@/components/ui/typography';
import { Monitor, Smartphone } from 'lucide-react';
import { Tablet } from './shared/icons/Tablet';
import { formatNumber } from './utils/formatters';
import { DevicesData } from '../types';

interface DevicesSectionProps {
	devices: DevicesData;
	totalVisits: number;
}

export function DevicesSection({ devices, totalVisits }: DevicesSectionProps) {
	return (
		<div className='bg-card p-6 rounded-lg shadow-sm border border-border h-full'>
			<TypographyH2 className='mb-6'>Devices</TypographyH2>
			<div className='space-y-4'>
				<DeviceRow
					icon={
						<Monitor
							size={16}
							className='mr-2 text-primary'
						/>
					}
					label='Desktop'
					count={devices.desktop}
					percentage={Math.round(
						(devices.desktop / totalVisits) * 100
					)}
				/>

				<DeviceRow
					icon={
						<Smartphone
							size={16}
							className='mr-2 text-secondary'
						/>
					}
					label='Mobile'
					count={devices.mobile}
					percentage={Math.round(
						(devices.mobile / totalVisits) * 100
					)}
				/>

				<DeviceRow
					icon={
						<Tablet
							size={16}
							className='mr-2 text-accent'
						/>
					}
					label='Tablet'
					count={devices.tablet}
					percentage={Math.round(
						(devices.tablet / totalVisits) * 100
					)}
				/>
			</div>
		</div>
	);
}

interface DeviceRowProps {
	icon: React.ReactNode;
	label: string;
	count: number;
	percentage: number;
}

function DeviceRow({ icon, label, count, percentage }: DeviceRowProps) {
	return (
		<div className='flex items-center justify-between'>
			<div className='flex items-center'>
				{icon}
				<span>{label}</span>
			</div>
			<div className='flex items-center'>
				<span className='mr-2'>{formatNumber(count)}</span>
				<span className='text-muted-foreground text-sm'>
					{percentage}%
				</span>
			</div>
		</div>
	);
}
