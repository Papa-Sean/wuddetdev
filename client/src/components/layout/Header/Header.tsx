'use client';

import { useAuth } from '@/context/AuthContext';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { MobileNav } from './MobileNav';

export function Header() {
	const { isAuthenticated, user, isLoading } = useAuth();

	return (
		<header className='relative border-b border-border bg-background/80 backdrop-blur-md'>
			{/* Decorative header line */}
			<div className='h-1 bg-gradient-to-r from-primary via-accent to-secondary'></div>
			<div className='container mx-auto px-4 py-4 flex items-center justify-between'>
				<Logo />
				<Navigation
					isLoggedIn={isAuthenticated}
					isAdmin={user?.role === 'admin'}
					isLoading={isLoading}
					userName={user?.name}
				/>
				<MobileNav
					isLoggedIn={isAuthenticated}
					isAdmin={user?.role === 'admin'}
					isLoading={isLoading}
					userName={user?.name}
				/>
			</div>
		</header>
	);
}
