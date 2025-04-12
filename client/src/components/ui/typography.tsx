import { cn } from '@/lib/utils';

interface TypographyProps {
	children: React.ReactNode;
	className?: string;
}

export function TypographyH1({ children, className }: TypographyProps) {
	return (
		<h1
			className={cn(
				'text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight',
				className
			)}
		>
			{children}
		</h1>
	);
}

export function TypographyH2({ children, className }: TypographyProps) {
	return (
		<h2
			className={cn(
				'text-3xl md:text-4xl font-bold tracking-tight',
				className
			)}
		>
			{children}
		</h2>
	);
}

export function TypographyLead({ children, className }: TypographyProps) {
	return (
		<p className={cn('text-xl text-muted-foreground', className)}>
			{children}
		</p>
	);
}

export function TypographyMuted({ children, className }: TypographyProps) {
	return (
		<p className={cn('text-sm text-muted-foreground', className)}>
			{children}
		</p>
	);
}
