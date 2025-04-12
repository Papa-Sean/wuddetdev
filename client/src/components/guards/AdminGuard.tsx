'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface AdminGuardProps {
	children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
	const { user, isLoading, isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated) {
				router.push('/login');
			} else if (user?.role !== 'admin') {
				router.push('/unauthorized');
			}
		}
	}, [isAuthenticated, isLoading, user, router]);

	if (isLoading) {
		return (
			<div className='h-screen flex items-center justify-center'>
				<div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full'></div>
			</div>
		);
	}

	// Only render children if user is admin
	return user?.role === 'admin' ? <>{children}</> : null;
}
