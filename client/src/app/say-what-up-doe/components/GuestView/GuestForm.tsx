import React, { useState } from 'react';
import { GuestFormData } from '../types';
import { cn } from '@/lib/utils';
import { contactApi } from '@/lib/api/contact';

interface GuestFormProps {
	formData: GuestFormData;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	onSubmit: (e: React.FormEvent) => void;
	theme: 'primary' | 'secondary' | 'accent';
	status?: {
		isSubmitting: boolean;
		isSuccess: boolean;
		error: string;
	};
}

export function GuestForm({
	formData,
	onChange,
	onSubmit,
	theme,
}: GuestFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submitError, setSubmitError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitError('');
		setSubmitSuccess(false);

		try {
			// Let the parent component handle the API call
			if (onSubmit) {
				await onSubmit(e);
				setSubmitSuccess(true);
			}
		} catch (error) {
			console.error('Error submitting message:', error);
			setSubmitError(
				error instanceof Error
					? error.message
					: 'Failed to send message. Please try again.'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='max-w-2xl mx-auto transition-all duration-500'>
			<div
				className={cn(
					'bg-card rounded-tr-lg rounded-br-lg shadow-lg overflow-hidden transition-all duration-500',
					'border-l-4',
					theme === 'primary' && 'border-primary',
					theme === 'secondary' && 'border-secondary',
					theme === 'accent' && 'border-accent'
				)}
			>
				<div className='p-6 md:p-8'>
					<h2 className='text-2xl font-bold mb-2'>
						Say Hello to the Community
					</h2>
					<p className='mb-6 text-muted-foreground'>
						Have a question or want to connect? Fill out this form
						to send a message to our admin team.
					</p>

					{submitSuccess ? (
						<div className='bg-green-50 border border-green-200 text-green-800 p-4 rounded mb-6'>
							<p className='font-medium'>
								Message sent successfully!
							</p>
							<p>
								Thank you for reaching out. Our team will get
								back to you soon.
							</p>
						</div>
					) : (
						<form
							onSubmit={handleSubmit}
							className='space-y-6'
						>
							{submitError && (
								<div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6'>
									<p className='font-medium'>Error:</p>
									<p>{submitError}</p>
								</div>
							)}

							<div>
								<label
									htmlFor='name'
									className='block font-medium mb-1'
								>
									Name
								</label>
								<input
									type='text'
									id='name'
									name='name'
									value={formData.name}
									onChange={onChange}
									className={cn(
										'w-full px-4 py-3 border rounded-md transition-all',
										'focus:outline-none focus:ring-2',
										theme === 'primary' &&
											'focus:ring-primary/50 focus:border-primary',
										theme === 'secondary' &&
											'focus:ring-secondary/50 focus:border-secondary',
										theme === 'accent' &&
											'focus:ring-accent/50 focus:border-accent'
									)}
									required
									disabled={isSubmitting}
								/>
							</div>

							<div>
								<label
									htmlFor='email'
									className='block font-medium mb-1'
								>
									Email
								</label>
								<input
									type='email'
									id='email'
									name='email'
									value={formData.email}
									onChange={onChange}
									className={cn(
										'w-full px-4 py-3 border rounded-md transition-all',
										'focus:outline-none focus:ring-2',
										theme === 'primary' &&
											'focus:ring-primary/50 focus:border-primary',
										theme === 'secondary' &&
											'focus:ring-secondary/50 focus:border-secondary',
										theme === 'accent' &&
											'focus:ring-accent/50 focus:border-accent'
									)}
									required
									disabled={isSubmitting}
								/>
							</div>

							<div>
								<label
									htmlFor='message'
									className='block font-medium mb-1'
								>
									Message
								</label>
								<textarea
									id='message'
									name='message'
									value={formData.message}
									onChange={onChange}
									rows={5}
									className={cn(
										'w-full px-4 py-3 border rounded-md transition-all',
										'focus:outline-none focus:ring-2',
										theme === 'primary' &&
											'focus:ring-primary/50 focus:border-primary',
										theme === 'secondary' &&
											'focus:ring-secondary/50 focus:border-secondary',
										theme === 'accent' &&
											'focus:ring-accent/50 focus:border-accent'
									)}
									required
									disabled={isSubmitting}
								></textarea>
								<p className='text-sm text-muted-foreground mt-1'>
									{500 - formData.message.length} characters
									remaining
								</p>
							</div>

							<button
								type='submit'
								className={cn(
									'w-full px-6 py-3 rounded-md font-medium text-primary-foreground transition-colors',
									theme === 'primary' &&
										'bg-primary hover:bg-primary/90',
									theme === 'secondary' &&
										'bg-secondary hover:bg-secondary/90',
									theme === 'accent' &&
										'bg-accent hover:bg-accent/90',
									isSubmitting &&
										'opacity-75 cursor-not-allowed'
								)}
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Sending...' : 'Send Message'}
							</button>
						</form>
					)}
				</div>
			</div>

			{/* Design elements */}
			<div className='mt-12 flex justify-center items-center gap-2'>
				{/* Existing design elements */}
			</div>
		</div>
	);
}
