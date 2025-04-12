import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
	isLoggedIn: boolean;
	isAdmin: boolean;
	toggleLogin: () => void;
	toggleAdmin: () => void;
	theme: 'primary' | 'secondary' | 'accent';
}

export function PageHeader({
	isLoggedIn,
	isAdmin,
	toggleLogin,
	toggleAdmin,
	theme,
}: PageHeaderProps) {
	return (
		<div className='flex flex-col md:flex-row justify-between items-center bg-primary mb-8 pb-6 p-4 rounded-2xl border-b border-muted'>
			<div className='mb-4 md:mb-0'>
				<h1
					className={cn(
						'text-3xl md:text-4xl font-bold tracking-tight inline-block transition-colors',
						theme === 'primary' && 'text-secondary',
						theme === 'secondary' && 'text-secondary',
						theme === 'accent' && 'text-accent'
					)}
				>
					Say What Up Doe
				</h1>
				<p className='text-accent mt-2'>
					Connect with the Detroit developer community
				</p>
			</div>

			{/* Demo toggles - remove in production */}
			<div className='flex gap-4 p-2 bg-primary border border-secondary rounded-md'>
				<button
					onClick={toggleLogin}
					className={cn(
						'px-4 py-2 rounded-full transition-all font-medium shadow-sm',
						isLoggedIn
							? 'bg-primary text-secondary border border-secondary'
							: 'bg-primary/50 text-secondary border border-secondary'
					)}
				>
					{isLoggedIn ? 'Logged In' : 'Guest'}
				</button>

				<button
					onClick={toggleAdmin}
					className={cn(
						'px-4 py-2 rounded-full transition-all font-medium shadow-sm',
						isAdmin
							? 'bg-primary text-secondary border border-secondary'
							: 'bg-primary text-secondary border border-secondary',
						!isLoggedIn &&
							'bg-primary text-primary border border-primary cursor-not-allowed'
					)}
					disabled={!isLoggedIn}
				>
					{isAdmin ? 'Admin' : 'Member'}
				</button>
			</div>
		</div>
	);
}
