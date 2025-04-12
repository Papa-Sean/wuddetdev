import { cn } from '@/lib/utils';

interface MidCenturyCardProps {
	children: React.ReactNode;
	className?: string;
	color?: 'primary' | 'secondary' | 'accent';
}

export function MidCenturyCard({
	children,
	className,
	color = 'primary',
}: MidCenturyCardProps) {
	const colorClasses = {
		primary: 'border-l-4 border-primary bg-primary/5',
		secondary: 'border-l-4 border-secondary bg-secondary/5',
		accent: 'border-l-4 border-accent bg-accent/5',
	};

	return (
		<div
			className={cn(
				'p-6 rounded-tr-lg rounded-br-lg relative',
				colorClasses[color],
				className
			)}
		>
			{children}
		</div>
	);
}
