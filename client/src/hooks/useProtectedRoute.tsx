'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteOptions {
	requiredRole?: 'member' | 'admin';
	redirectTo?: string;
}

export function useProtectedRoute(options: ProtectedRouteOptions = {}) {
	const { requiredRole, redirectTo = '/login' } = options;
	const { isAuthenticated, isLoading, user } = useAuth();
	const router = useRouter();
	const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

	useEffect(() => {
		// Only make a decision after authentication loading is complete
		if (!isLoading) {
			let authorized = isAuthenticated;

			// Additional role check if required
			if (authorized && requiredRole) {
				authorized =
					user?.role === requiredRole ||
					// Important: Admin should have access to member routes
					(requiredRole === 'member' && user?.role === 'admin');
			}

			setIsAuthorized(authorized);

			// Handle redirection when not authorized
			if (!authorized) {
				console.log('Not authorized, redirecting to', redirectTo);
				router.push(redirectTo);
			}
		}
	}, [
		isAuthenticated,
		isLoading,
		requiredRole,
		router,
		redirectTo,
		user?.role,
	]);

	// Return variables that can be used to control UI
	return {
		isLoading: isLoading || isAuthorized === null,
		isAuthorized,
	};
}
