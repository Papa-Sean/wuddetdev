'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { TypographyH1, TypographyH2 } from '@/components/ui/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	User,
	Mail,
	MapPin,
	Calendar,
	Edit2,
	Check,
	X,
	Save,
	Shield,
	AlertCircle,
} from 'lucide-react';
import { michiganCities } from '@/app/signup/components/LocationSelect';

export default function ProfilePage() {
	const { user, isAuthenticated, isLoading, updateUser } = useAuth();
	const router = useRouter();

	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [editError, setEditError] = useState('');
	const [editSuccess, setEditSuccess] = useState(false);

	// Form state
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		location: '',
		bio: '',
	});

	// Redirect if not authenticated
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push('/login');
		}
	}, [isAuthenticated, isLoading, router]);

	// Initialize form data when user loaded
	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				location: user.location || '',
				bio: user.bio || '',
			});
		}
	}, [user]);

	if (isLoading) {
		return (
			<div className='h-screen flex items-center justify-center'>
				<div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full'></div>
			</div>
		);
	}

	if (!user) {
		return null; // Will redirect due to the effect
	}

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		setEditError('');
		setEditSuccess(false);

		try {
			// Omit email as it might require special verification flow
			const dataToUpdate = {
				name: formData.name,
				location: formData.location,
				bio: formData.bio,
			};

			await updateUser(dataToUpdate);
			setEditSuccess(true);
			setIsEditing(false);

			// Reset success message after 3 seconds
			setTimeout(() => {
				setEditSuccess(false);
			}, 3000);
		} catch (error) {
			setEditError(
				error instanceof Error
					? error.message
					: 'Failed to update profile'
			);
		} finally {
			setIsSaving(false);
		}
	};

	const cancelEdit = () => {
		// Reset form data to current user data
		setFormData({
			name: user.name || '',
			email: user.email || '',
			location: user.location || '',
			bio: user.bio || '',
		});
		setIsEditing(false);
		setEditError('');
	};

	// Format date nicely
	const formatDate = (dateString?: string) => {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='max-w-4xl mx-auto'>
				<div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
					<TypographyH1>My Profile</TypographyH1>

					{!isEditing ? (
						<Button
							onClick={() => setIsEditing(true)}
							className='flex items-center gap-2'
						>
							<Edit2 size={16} />
							Edit Profile
						</Button>
					) : (
						<div className='flex gap-2'>
							<Button
								variant='outline'
								onClick={cancelEdit}
								className='flex items-center gap-2'
							>
								<X size={16} />
								Cancel
							</Button>
							<Button
								onClick={handleSubmit}
								className='flex items-center gap-2'
								disabled={isSaving}
							>
								{isSaving ? (
									<>
										<div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2'></div>
										Saving...
									</>
								) : (
									<>
										<Save size={16} />
										Save Changes
									</>
								)}
							</Button>
						</div>
					)}
				</div>

				{/* Success/Error Messages */}
				{editSuccess && (
					<div className='bg-green-50 border border-green-200 text-green-800 p-4 rounded-md mb-6 flex items-start gap-2'>
						<Check
							size={18}
							className='shrink-0 mt-0.5'
						/>
						<div>Profile updated successfully!</div>
					</div>
				)}

				{editError && (
					<div className='bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6 flex items-start gap-2'>
						<AlertCircle
							size={18}
							className='shrink-0 mt-0.5'
						/>
						<div>{editError}</div>
					</div>
				)}

				<div className='bg-card border border-border rounded-xl shadow-sm overflow-hidden'>
					{/* Profile Header */}
					<div className='bg-muted/30 p-6 md:p-8 border-b border-border'>
						<div className='flex flex-col md:flex-row gap-6 items-center md:items-start'>
							<div className='relative'>
								<Avatar className='w-24 h-24 border-4 border-background'>
									<AvatarFallback className='text-2xl bg-primary text-primary-foreground'>
										{user.name?.substring(0, 2) || 'U'}
									</AvatarFallback>
									<AvatarImage src='' />
								</Avatar>
								{user.role === 'admin' && (
									<div className='absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1'>
										<Shield size={12} />
										Admin
									</div>
								)}
							</div>

							<div className='text-center md:text-left'>
								<h2 className='text-2xl font-bold'>
									{user.name}
								</h2>
								<p className='text-muted-foreground flex items-center justify-center md:justify-start gap-1 mt-1'>
									<Mail size={14} />
									{user.email}
								</p>
								<p className='text-muted-foreground flex items-center justify-center md:justify-start gap-1 mt-1'>
									<MapPin size={14} />
									{user.location || 'Location not set'}
								</p>
								<p className='text-muted-foreground flex items-center justify-center md:justify-start gap-1 mt-1'>
									<Calendar size={14} />
									Member since{' '}
									{formatDate(user.joinedAt || '')}
								</p>
							</div>
						</div>
					</div>

					{/* Profile Content */}
					<div className='p-6 md:p-8'>
						{isEditing ? (
							<form
								onSubmit={handleSubmit}
								className='space-y-6'
							>
								<div>
									<label className='block font-medium mb-1'>
										Name
									</label>
									<input
										type='text'
										name='name'
										value={formData.name}
										onChange={handleChange}
										className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
										required
									/>
								</div>

								<div>
									<label className='block font-medium mb-1'>
										Email
									</label>
									<input
										type='email'
										name='email'
										value={formData.email}
										disabled
										className='w-full px-4 py-2 border rounded-md bg-muted/30 cursor-not-allowed'
									/>
									<p className='text-xs text-muted-foreground mt-1'>
										Email cannot be changed
									</p>
								</div>

								<div>
									<label className='block font-medium mb-1'>
										Location
									</label>
									<select
										name='location'
										value={formData.location}
										onChange={handleChange}
										className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
									>
										<option value=''>
											Select your city
										</option>
										{michiganCities.map((city) => (
											<option
												key={city}
												value={city}
											>
												{city}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className='block font-medium mb-1'>
										Bio
									</label>
									<textarea
										name='bio'
										value={formData.bio || ''}
										onChange={handleChange}
										rows={4}
										className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
										placeholder='Tell us about yourself...'
									></textarea>
								</div>
							</form>
						) : (
							<>
								<div className='mb-8'>
									<TypographyH2 className='mb-4'>
										About Me
									</TypographyH2>
									<p className='text-muted-foreground'>
										{user.bio ||
											"This user hasn't added a bio yet."}
									</p>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div className='bg-muted/20 p-4 rounded-lg'>
										<h3 className='font-medium mb-2'>
											Account Details
										</h3>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<span className='text-muted-foreground'>
													User Type
												</span>
												<span
													className={cn(
														'px-2 py-1 rounded-full text-xs font-medium',
														user.role === 'admin'
															? 'bg-primary/10 text-primary'
															: 'bg-muted text-muted-foreground'
													)}
												>
													{user.role === 'admin'
														? 'Administrator'
														: 'Member'}
												</span>
											</div>
											<div className='flex items-center justify-between'>
												<span className='text-muted-foreground'>
													Account Status
												</span>
												<span className='bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium'>
													Active
												</span>
											</div>
											<div className='flex items-center justify-between'>
												<span className='text-muted-foreground'>
													Last Login
												</span>
												<span>Recently</span>
											</div>
										</div>
									</div>

									<div className='bg-muted/20 p-4 rounded-lg'>
										<h3 className='font-medium mb-2'>
											Activity Stats
										</h3>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<span className='text-muted-foreground'>
													Posts
												</span>
												<span>3</span>
											</div>
											<div className='flex items-center justify-between'>
												<span className='text-muted-foreground'>
													Comments
												</span>
												<span>12</span>
											</div>
											<div className='flex items-center justify-between'>
												<span className='text-muted-foreground'>
													Projects
												</span>
												<span>1</span>
											</div>
										</div>
									</div>
								</div>
							</>
						)}
					</div>
				</div>

				{/* Account Management Section */}
				<div className='mt-8 bg-card border border-border rounded-xl shadow-sm overflow-hidden'>
					<div className='bg-muted/30 p-4 border-b border-border'>
						<h2 className='font-bold'>Account Management</h2>
					</div>
					<div className='p-6'>
						<div className='space-y-4'>
							<Button
								variant='outline'
								className='w-full justify-start text-left'
							>
								Change Password
							</Button>
							<Button
								variant='outline'
								className='w-full justify-start text-left'
							>
								Privacy Settings
							</Button>
							<Button
								variant='outline'
								className='w-full justify-start text-left border-red-200 text-red-600 hover:bg-red-50'
							>
								Delete Account
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
