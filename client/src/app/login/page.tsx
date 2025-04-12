'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FormHeader } from '../signup/components/FormHeader';
import { LoginForm } from './components/LoginForm';

export default function LoginPage() {
	const { login, error, clearError } = useAuth();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleLogin = async (email: string, password: string) => {
		setIsSubmitting(true);
		try {
			await login({ email, password });
			router.push('/'); // Redirect to home page after successful login
		} catch (err) {
			// Error is already handled in the context
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='max-w-md mx-auto'>
				<FormHeader />
				<div className='bg-card rounded-lg shadow-lg p-6 md:p-8'>
					{error && (
						<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6'>
							{error}
							<button
								className='float-right text-sm font-medium'
								onClick={clearError}
							>
								Dismiss
							</button>
						</div>
					)}

					<LoginForm
						onSubmit={handleLogin}
						isSubmitting={isSubmitting}
					/>

					
				</div>
			</div>
		</div>
	);
}
