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
					{isLoggedIn
						? 'Connect with the Detroit developer community'
						: 'Get in touch with the Detroit developer community'}
				</p>
			</div>

			{/* Show login link for guests */}
			{!isLoggedIn && (
				<div className='flex flex-col gap-2'>
					<p className='text-sm text-secondary'>
						Want to join the conversation?
					</p>
					<a
						href='/login'
						className='px-4 py-2 bg-secondary text-primary rounded-md hover:bg-secondary/90 text-center'
					>
						Log in or Sign up
					</a>
				</div>
			)}

			{/* Demo toggles or admin controls if logged in */}
			{isLoggedIn && (
				<div className='flex gap-4 p-2 bg-primary border border-secondary rounded-md'>
					{/* Your existing controls */}
				</div>
			)}
		</div>
	);
}
