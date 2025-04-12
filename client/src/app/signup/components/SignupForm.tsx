'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { InputField } from './InputField';
import { LocationSelect } from './LocationSelect';
import { ErrorAlert } from './ErrorAlert';

export function SignupForm() {
	const { signup } = useAuth();
	const router = useRouter();

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		location: '',
	});

	const [errors, setErrors] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		location: '',
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [signupError, setSignupError] = useState('');

	// Handle input changes
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
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

		// Clear general signup error when user makes changes
		if (signupError) {
			setSignupError('');
		}
	};

	// Validate form
	const validateForm = () => {
		const newErrors = {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			location: '',
		};

		let isValid = true;

		// Name validation
		if (!formData.name.trim()) {
			newErrors.name = 'Name is required';
			isValid = false;
		}

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
		} else if (formData.password.length < 8) {
			newErrors.password = 'Password must be at least 8 characters';
			isValid = false;
		}

		// Confirm password validation
		if (!formData.confirmPassword) {
			newErrors.confirmPassword = 'Please confirm your password';
			isValid = false;
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
			isValid = false;
		}

		// Location validation
		if (!formData.location) {
			newErrors.location = 'Please select your location';
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

		setIsSubmitting(true);
		setSignupError('');

		try {
			console.log('Form data being sent:', {
				name: formData.name,
				email: formData.email,
				password: formData.password,
				location: formData.location,
			});

			// Submit to the MongoDB-backed API
			await signup({
				name: formData.name,
				email: formData.email,
				password: formData.password,
				location: formData.location,
			});

			// If successful, redirect to login page
			router.push('/login?signup=success');
		} catch (error) {
			// Handle errors from the API
			const errorMessage =
				error instanceof Error
					? error.message
					: 'An error occurred during signup';
			setSignupError(errorMessage);

			console.error('Signup error:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			{signupError && <ErrorAlert message={signupError} />}

			<form
				onSubmit={handleSubmit}
				className='space-y-5'
			>
				<InputField
					id='name'
					name='name'
					label='Full Name'
					value={formData.name}
					error={errors.name}
					placeholder='John Doe'
					disabled={isSubmitting}
					onChange={handleChange}
				/>

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

				<InputField
					id='confirmPassword'
					name='confirmPassword'
					label='Confirm Password'
					type='password'
					value={formData.confirmPassword}
					error={errors.confirmPassword}
					disabled={isSubmitting}
					onChange={handleChange}
				/>

				<LocationSelect
					name='location'
					label='Location'
					value={formData.location}
					error={errors.location}
					disabled={isSubmitting}
					onChange={handleChange}
				/>

				<button
					type='submit'
					className='w-full bg-primary text-primary-foreground px-4 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6'
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Creating Account...' : 'Create Account'}
				</button>
			</form>

			
		</>
	);
}
