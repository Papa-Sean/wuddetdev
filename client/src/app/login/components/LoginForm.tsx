'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { InputField } from '../../signup/components/InputField';
import { ErrorAlert } from './ErrorAlert';

interface LoginFormProps {
	onSubmit: (email: string, password: string) => Promise<void>;
	isSubmitting: boolean;
}

export function LoginForm({ onSubmit, isSubmitting }: LoginFormProps) {
	const router = useRouter();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const [errors, setErrors] = useState({
		email: '',
		password: '',
	});

	const [loginError, setLoginError] = useState('');

	// Handle input changes
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear error when user types
		if (errors[name as keyof typeof errors]) {
			setErrors((prev) => ({
				...prev,
				[name]: '',
			}));
		}

		// Clear general login error when user makes changes
		if (loginError) {
			setLoginError('');
		}
	};

	// Validate form
	const validateForm = () => {
		const newErrors = {
			email: '',
			password: '',
		};

		let isValid = true;

		// Email validation
		if (!formData.email) {
			newErrors.email = 'Email is required';
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email is invalid';
			isValid = false;
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = 'Password is required';
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		try {
			await onSubmit(formData.email, formData.password);
		} catch (error) {
			// This error is likely handled by the onSubmit function in the parent component
			console.error('Login error in form:', error);
		}
	};

	return (
		<>
			{loginError && <ErrorAlert message={loginError} />}

			<form
				onSubmit={handleSubmit}
				className='space-y-5'
			>
				<InputField
					id='email'
					name='email'
					label='Email Address'
					type='email'
					value={formData.email}
					error={errors.email}
					placeholder='you@example.com'
					disabled={isSubmitting}
					onChange={handleChange}
				/>

				<InputField
					id='password'
					name='password'
					label='Password'
					type='password'
					value={formData.password}
					error={errors.password}
					disabled={isSubmitting}
					onChange={handleChange}
				/>

				<div className='flex items-center justify-between'>
					<label className='flex items-center'>
						<input
							type='checkbox'
							className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
						/>
						<span className='ml-2 text-sm text-muted-foreground'>
							Remember me
						</span>
					</label>

					<Link
						href='/forgot-password'
						className='text-sm text-primary hover:underline'
					>
						Forgot password?
					</Link>
				</div>

				<button
					type='submit'
					className='w-full bg-primary text-primary-foreground px-4 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Signing In...' : 'Sign In'}
				</button>
			</form>

			<div className='mt-6 text-center'>
				<p className='text-muted-foreground'>
					Don't have an account?{' '}
					<Link
						href='/signup'
						className='text-primary hover:underline font-medium'
					>
						Sign Up
					</Link>
				</p>
			</div>
		</>
	);
}
