import { cn } from '@/lib/utils';

interface StarburstProps {
	className?: string;
	color?: 'primary' | 'secondary' | 'accent';
}

export function Starburst({ className, color = 'primary' }: StarburstProps) {
	const colorClasses = {
		primary: 'text-primary',
		secondary: 'text-secondary',
		accent: 'text-accent',
	};

	return (
		<div
			className={cn(
				'relative inline-block animate-spin-slow',
				colorClasses[color],
				className
			)}
		>
			<svg
				width='60'
				height='60'
				viewBox='0 0 60 60'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M30 0L32.4 27.6L60 30L32.4 32.4L30 60L27.6 32.4L0 30L27.6 27.6L30 0Z'
					fill='currentColor'
				/>
			</svg>
		</div>
	);
}
