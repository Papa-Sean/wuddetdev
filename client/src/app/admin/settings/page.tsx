'use client';

import { useState } from 'react';
import { AdminGuard } from '@/components/guards/AdminGuard';
import { TypographyH1, TypographyH2 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	Save,
	Settings,
	Bell,
	Mail,
	Globe,
	Shield,
	Database,
	RefreshCcw,
	Check,
	Paintbrush,
	Moon,
	Sun,
	Key,
	Upload,
	Download,
	AlertTriangle,
	PlaySquare,
	FileJson,
	MessageSquare,
} from 'lucide-react';

type SettingsCategory =
	| 'general'
	| 'appearance'
	| 'notifications'
	| 'security'
	| 'backups'
	| 'integrations';
type ThemeMode = 'light' | 'dark' | 'system';
type ColorScheme = 'default' | 'high-contrast' | 'retro';

export default function SettingsPage() {
	// Active settings category
	const [activeCategory, setActiveCategory] =
		useState<SettingsCategory>('general');

	// Settings state
	const [settings, setSettings] = useState({
		general: {
			siteName: 'wuddevdet',
			siteDescription: "Detroit's Web Dev Hub",
			contactEmail: 'admin@wuddetdev.com',
			maxUploadSize: 5,
			enableRegistration: true,
			requireEmailVerification: true,
			moderateNewPosts: false,
			moderateNewComments: false,
		},
		appearance: {
			themeMode: 'light' as ThemeMode,
			colorScheme: 'default' as ColorScheme,
			enableAnimations: true,
			showUserProfiles: true,
			disableAvatars: false,
			compactLayout: false,
		},
		notifications: {
			emailNotifications: true,
			newUserRegistration: true,
			newGuestMessage: true,
			newComment: false,
			digestFrequency: 'daily',
			batchNotifications: true,
		},
		security: {
			sessionTimeout: 60,
			maxLoginAttempts: 5,
			twoFactorAuthForAdmins: false,
			strongPasswordPolicy: true,
			allowPublicProfiles: true,
			apiRequestsPerMinute: 100,
		},
	});

	// Form state
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [backupInProgress, setBackupInProgress] = useState(false);
	const [restoreInProgress, setRestoreInProgress] = useState(false);

	// Handle settings change
	const handleSettingChange = (
		category: keyof typeof settings,
		key: string,
		value: any
	) => {
		setSettings((prev) => ({
			...prev,
			[category]: {
				...prev[category as keyof typeof prev],
				[key]: value,
			},
		}));
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setIsSubmitting(true);

		// Simulating API call
		setTimeout(() => {
			setIsSubmitting(false);
			setShowSuccess(true);

			// Hide success message after 3 seconds
			setTimeout(() => {
				setShowSuccess(false);
			}, 3000);
		}, 1000);
	};

	// Handle backup creation
	const handleBackup = () => {
		setBackupInProgress(true);

		// Simulating backup process
		setTimeout(() => {
			setBackupInProgress(false);

			// Create and download a mock JSON file
			const backupData = JSON.stringify(settings, null, 2);
			const blob = new Blob([backupData], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `wuddetdev-backup-${
				new Date().toISOString().split('T')[0]
			}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}, 1500);
	};

	return (
		<AdminGuard>
			<div className='container mx-auto px-4 py-8'>
				<div className='mb-8'>
					<TypographyH1>Site Settings</TypographyH1>
					<p className='text-muted-foreground'>
						Configure your wuddetdev platform settings
					</p>
				</div>

				<div className='flex flex-col md:flex-row gap-6'>
					{/* Settings Navigation */}
					<aside className='w-full md:w-64 shrink-0'>
						<div className='bg-card rounded-lg shadow-sm border border-border p-2'>
							<nav className='space-y-1'>
								<button
									onClick={() => setActiveCategory('general')}
									className={cn(
										'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
										activeCategory === 'general'
											? 'bg-primary/10 text-primary font-medium'
											: 'hover:bg-muted/50 text-foreground'
									)}
								>
									<Settings size={18} />
									General
								</button>

								<button
									onClick={() =>
										setActiveCategory('appearance')
									}
									className={cn(
										'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
										activeCategory === 'appearance'
											? 'bg-primary/10 text-primary font-medium'
											: 'hover:bg-muted/50 text-foreground'
									)}
								>
									<Paintbrush size={18} />
									Appearance
								</button>

								<button
									onClick={() =>
										setActiveCategory('notifications')
									}
									className={cn(
										'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
										activeCategory === 'notifications'
											? 'bg-primary/10 text-primary font-medium'
											: 'hover:bg-muted/50 text-foreground'
									)}
								>
									<Bell size={18} />
									Notifications
								</button>

								<button
									onClick={() =>
										setActiveCategory('security')
									}
									className={cn(
										'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
										activeCategory === 'security'
											? 'bg-primary/10 text-primary font-medium'
											: 'hover:bg-muted/50 text-foreground'
									)}
								>
									<Shield size={18} />
									Security
								</button>

								<button
									onClick={() => setActiveCategory('backups')}
									className={cn(
										'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
										activeCategory === 'backups'
											? 'bg-primary/10 text-primary font-medium'
											: 'hover:bg-muted/50 text-foreground'
									)}
								>
									<Database size={18} />
									Backups & Export
								</button>

								<button
									onClick={() =>
										setActiveCategory('integrations')
									}
									className={cn(
										'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
										activeCategory === 'integrations'
											? 'bg-primary/10 text-primary font-medium'
											: 'hover:bg-muted/50 text-foreground'
									)}
								>
									<Key size={18} />
									Integrations & APIs
								</button>
							</nav>
						</div>

						<div className='mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200'>
							<div className='flex items-start gap-2'>
								<AlertTriangle
									size={18}
									className='shrink-0 mt-0.5'
								/>
								<div>
									<p className='text-sm font-medium'>
										Setting Changes
									</p>
									<p className='text-xs mt-1'>
										Changes may take up to 5 minutes to
										fully propagate across the platform.
									</p>
								</div>
							</div>
						</div>
					</aside>

					{/* Settings Content */}
					<div className='flex-1'>
						<div className='bg-card rounded-lg shadow-sm border border-border p-6'>
							<form onSubmit={handleSubmit}>
								{/* Success Message */}
								{showSuccess && (
									<div className='mb-6 p-4 bg-green-50 text-green-800 rounded-md border border-green-200 flex items-center gap-2'>
										<Check size={18} />
										<span>
											Settings saved successfully!
										</span>
									</div>
								)}

								{/* General Settings */}
								{activeCategory === 'general' && (
									<div>
										<TypographyH2 className='mb-6'>
											General Settings
										</TypographyH2>

										<div className='space-y-6'>
											<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
												<div>
													<label className='block text-sm font-medium mb-1'>
														Site Name
													</label>
													<input
														type='text'
														value={
															settings.general
																.siteName
														}
														onChange={(e) =>
															handleSettingChange(
																'general',
																'siteName',
																e.target.value
															)
														}
														className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
													/>
												</div>

												<div>
													<label className='block text-sm font-medium mb-1'>
														Site Description
													</label>
													<input
														type='text'
														value={
															settings.general
																.siteDescription
														}
														onChange={(e) =>
															handleSettingChange(
																'general',
																'siteDescription',
																e.target.value
															)
														}
														className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
													/>
												</div>
											</div>

											<div>
												<label className='block text-sm font-medium mb-1'>
													Contact Email
												</label>
												<input
													type='email'
													value={
														settings.general
															.contactEmail
													}
													onChange={(e) =>
														handleSettingChange(
															'general',
															'contactEmail',
															e.target.value
														)
													}
													className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
												/>
											</div>

											<div>
												<label className='block text-sm font-medium mb-1'>
													Max Upload Size (MB)
												</label>
												<input
													type='number'
													value={
														settings.general
															.maxUploadSize
													}
													onChange={(e) =>
														handleSettingChange(
															'general',
															'maxUploadSize',
															parseInt(
																e.target.value
															)
														)
													}
													min='1'
													max='50'
													className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
												/>
											</div>

											<div className='space-y-3'>
												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='enableRegistration'
														checked={
															settings.general
																.enableRegistration
														}
														onChange={(e) =>
															handleSettingChange(
																'general',
																'enableRegistration',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
													<label
														htmlFor='enableRegistration'
														className='text-sm'
													>
														Enable User Registration
													</label>
												</div>

												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='requireEmailVerification'
														checked={
															settings.general
																.requireEmailVerification
														}
														onChange={(e) =>
															handleSettingChange(
																'general',
																'requireEmailVerification',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
													<label
														htmlFor='requireEmailVerification'
														className='text-sm'
													>
														Require Email
														Verification
													</label>
												</div>

												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='moderateNewPosts'
														checked={
															settings.general
																.moderateNewPosts
														}
														onChange={(e) =>
															handleSettingChange(
																'general',
																'moderateNewPosts',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
													<label
														htmlFor='moderateNewPosts'
														className='text-sm'
													>
														Moderate New Posts
													</label>
												</div>

												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='moderateNewComments'
														checked={
															settings.general
																.moderateNewComments
														}
														onChange={(e) =>
															handleSettingChange(
																'general',
																'moderateNewComments',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
													<label
														htmlFor='moderateNewComments'
														className='text-sm'
													>
														Moderate New Comments
													</label>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Appearance Settings */}
								{activeCategory === 'appearance' && (
									<div>
										<TypographyH2 className='mb-6'>
											Appearance Settings
										</TypographyH2>

										<div className='space-y-6'>
											<div>
												<label className='block text-sm font-medium mb-3'>
													Theme Mode
												</label>
												<div className='flex gap-4'>
													<div
														className={cn(
															'flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer transition-all',
															settings.appearance
																.themeMode ===
																'light'
																? 'border-primary bg-primary/5'
																: 'border-border hover:border-muted-foreground'
														)}
														onClick={() =>
															handleSettingChange(
																'appearance',
																'themeMode',
																'light'
															)
														}
													>
														<div className='h-20 w-20 rounded-md bg-white border flex items-center justify-center'>
															<Sun
																size={24}
																className='text-yellow-500'
															/>
														</div>
														<span className='text-sm font-medium'>
															Light
														</span>
													</div>

													<div
														className={cn(
															'flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer transition-all',
															settings.appearance
																.themeMode ===
																'dark'
																? 'border-primary bg-primary/5'
																: 'border-border hover:border-muted-foreground'
														)}
														onClick={() =>
															handleSettingChange(
																'appearance',
																'themeMode',
																'dark'
															)
														}
													>
														<div className='h-20 w-20 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center'>
															<Moon
																size={24}
																className='text-blue-300'
															/>
														</div>
														<span className='text-sm font-medium'>
															Dark
														</span>
													</div>

													<div
														className={cn(
															'flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer transition-all',
															settings.appearance
																.themeMode ===
																'system'
																? 'border-primary bg-primary/5'
																: 'border-border hover:border-muted-foreground'
														)}
														onClick={() =>
															handleSettingChange(
																'appearance',
																'themeMode',
																'system'
															)
														}
													>
														<div className='h-20 w-20 rounded-md bg-gradient-to-br from-white to-gray-800 border flex items-center justify-center'>
															<div className='h-12 w-12 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center'>
																<RefreshCcw
																	size={20}
																	className='text-gray-600'
																/>
															</div>
														</div>
														<span className='text-sm font-medium'>
															System
														</span>
													</div>
												</div>
											</div>

											<div>
												<label className='block text-sm font-medium mb-1'>
													Color Scheme
												</label>
												<select
													value={
														settings.appearance
															.colorScheme
													}
													onChange={(e) =>
														handleSettingChange(
															'appearance',
															'colorScheme',
															e.target.value
														)
													}
													className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
												>
													<option value='default'>
														Default
													</option>
													<option value='high-contrast'>
														High Contrast
													</option>
													<option value='retro'>
														Retro
													</option>
												</select>
												<p className='mt-1 text-xs text-muted-foreground'>
													Changes will affect all
													users viewing the site.
													Personal preference settings
													may override this.
												</p>
											</div>

											<div className='space-y-3'>
												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='enableAnimations'
														checked={
															settings.appearance
																.enableAnimations
														}
														onChange={(e) =>
															handleSettingChange(
																'appearance',
																'enableAnimations',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
													<label
														htmlFor='enableAnimations'
														className='text-sm'
													>
														Enable UI Animations
													</label>
												</div>

												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='showUserProfiles'
														checked={
															settings.appearance
																.showUserProfiles
														}
														onChange={(e) =>
															handleSettingChange(
																'appearance',
																'showUserProfiles',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
													<label
														htmlFor='showUserProfiles'
														className='text-sm'
													>
														Show User Profiles
													</label>
												</div>

												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='disableAvatars'
														checked={
															settings.appearance
																.disableAvatars
														}
														onChange={(e) =>
															handleSettingChange(
																'appearance',
																'disableAvatars',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
													<label
														htmlFor='disableAvatars'
														className='text-sm'
													>
														Disable User Avatars
													</label>
												</div>

												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='compactLayout'
														checked={
															settings.appearance
																.compactLayout
														}
														onChange={(e) =>
															handleSettingChange(
																'appearance',
																'compactLayout',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
													<label
														htmlFor='compactLayout'
														className='text-sm'
													>
														Use Compact Layout
													</label>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Notifications Settings */}
								{activeCategory === 'notifications' && (
									<div>
										<TypographyH2 className='mb-6'>
											Notification Settings
										</TypographyH2>

										<div className='space-y-6'>
											<div className='space-y-3'>
												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='emailNotifications'
														checked={
															settings
																.notifications
																.emailNotifications
														}
														onChange={(e) =>
															handleSettingChange(
																'notifications',
																'emailNotifications',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
													<label
														htmlFor='emailNotifications'
														className='text-sm font-medium'
													>
														Enable Email
														Notifications
													</label>
												</div>

												<p className='text-xs text-muted-foreground ml-6'>
													Master toggle for all email
													notifications. Turning this
													off will disable all email
													notifications regardless of
													other settings.
												</p>
											</div>

											<div className='pl-6 space-y-3 border-l-2 border-muted'>
												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='newUserRegistration'
														checked={
															settings
																.notifications
																.newUserRegistration
														}
														disabled={
															!settings
																.notifications
																.emailNotifications
														}
														onChange={(e) =>
															handleSettingChange(
																'notifications',
																'newUserRegistration',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300 disabled:opacity-50'
													/>
													<label
														htmlFor='newUserRegistration'
														className={cn(
															'text-sm',
															!settings
																.notifications
																.emailNotifications &&
																'opacity-50'
														)}
													>
														New User Registration
													</label>
												</div>

												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='newGuestMessage'
														checked={
															settings
																.notifications
																.newGuestMessage
														}
														disabled={
															!settings
																.notifications
																.emailNotifications
														}
														onChange={(e) =>
															handleSettingChange(
																'notifications',
																'newGuestMessage',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300 disabled:opacity-50'
													/>
													<label
														htmlFor='newGuestMessage'
														className={cn(
															'text-sm',
															!settings
																.notifications
																.emailNotifications &&
																'opacity-50'
														)}
													>
														New Guest Message
													</label>
												</div>

												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='newComment'
														checked={
															settings
																.notifications
																.newComment
														}
														disabled={
															!settings
																.notifications
																.emailNotifications
														}
														onChange={(e) =>
															handleSettingChange(
																'notifications',
																'newComment',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300 disabled:opacity-50'
													/>
													<label
														htmlFor='newComment'
														className={cn(
															'text-sm',
															!settings
																.notifications
																.emailNotifications &&
																'opacity-50'
														)}
													>
														New Comment
													</label>
												</div>
											</div>

											<div>
												<label className='block text-sm font-medium mb-1'>
													Admin Digest Frequency
												</label>
												<select
													value={
														settings.notifications
															.digestFrequency
													}
													onChange={(e) =>
														handleSettingChange(
															'notifications',
															'digestFrequency',
															e.target.value
														)
													}
													disabled={
														!settings.notifications
															.emailNotifications
													}
													className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50'
												>
													<option value='daily'>
														Daily
													</option>
													<option value='weekly'>
														Weekly
													</option>
													<option value='biweekly'>
														Bi-Weekly
													</option>
													<option value='monthly'>
														Monthly
													</option>
													<option value='never'>
														Never
													</option>
												</select>
											</div>

											<div className='flex items-center gap-2'>
												<input
													type='checkbox'
													id='batchNotifications'
													checked={
														settings.notifications
															.batchNotifications
													}
													disabled={
														!settings.notifications
															.emailNotifications
													}
													onChange={(e) =>
														handleSettingChange(
															'notifications',
															'batchNotifications',
															e.target.checked
														)
													}
													className='w-4 h-4 rounded border-gray-300 disabled:opacity-50'
												/>
												<label
													htmlFor='batchNotifications'
													className={cn(
														'text-sm',
														!settings.notifications
															.emailNotifications &&
															'opacity-50'
													)}
												>
													Batch Notifications (Limit
													to one email per hour)
												</label>
											</div>
										</div>
									</div>
								)}

								{/* Security Settings */}
								{activeCategory === 'security' && (
									<div>
										<TypographyH2 className='mb-6'>
											Security Settings
										</TypographyH2>

										<div className='space-y-6'>
											<div>
												<label className='block text-sm font-medium mb-1'>
													Session Timeout (minutes)
												</label>
												<input
													type='number'
													value={
														settings.security
															.sessionTimeout
													}
													onChange={(e) =>
														handleSettingChange(
															'security',
															'sessionTimeout',
															parseInt(
																e.target.value
															)
														)
													}
													min='15'
													max='1440'
													className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
												/>
												<p className='mt-1 text-xs text-muted-foreground'>
													Users will be automatically
													logged out after this period
													of inactivity
												</p>
											</div>

											<div>
												<label className='block text-sm font-medium mb-1'>
													Max Login Attempts
												</label>
												<input
													type='number'
													value={
														settings.security
															.maxLoginAttempts
													}
													onChange={(e) =>
														handleSettingChange(
															'security',
															'maxLoginAttempts',
															parseInt(
																e.target.value
															)
														)
													}
													min='3'
													max='10'
													className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
												/>
												<p className='mt-1 text-xs text-muted-foreground'>
													Account will be temporarily
													locked after this many
													failed login attempts
												</p>
											</div>

											<div className='space-y-3'>
												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='twoFactorAuthForAdmins'
														checked={
															settings.security
																.twoFactorAuthForAdmins
														}
														onChange={(e) =>
															handleSettingChange(
																'security',
																'twoFactorAuthForAdmins',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
													<label
														htmlFor='twoFactorAuthForAdmins'
														className='text-sm'
													>
														Require 2FA for Admin
														Accounts
													</label>
												</div>

												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='strongPasswordPolicy'
														checked={
															settings.security
																.strongPasswordPolicy
														}
														onChange={(e) =>
															handleSettingChange(
																'security',
																'strongPasswordPolicy',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
													<label
														htmlFor='strongPasswordPolicy'
														className='text-sm'
													>
														Enforce Strong Password
														Policy
													</label>
												</div>

												<div className='flex items-center gap-2'>
													<input
														type='checkbox'
														id='allowPublicProfiles'
														checked={
															settings.security
																.allowPublicProfiles
														}
														onChange={(e) =>
															handleSettingChange(
																'security',
																'allowPublicProfiles',
																e.target.checked
															)
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
													<label
														htmlFor='allowPublicProfiles'
														className='text-sm'
													>
														Allow Public User
														Profiles
													</label>
												</div>
											</div>

											<div>
												<label className='block text-sm font-medium mb-1'>
													API Rate Limit (requests per
													minute)
												</label>
												<input
													type='number'
													value={
														settings.security
															.apiRequestsPerMinute
													}
													onChange={(e) =>
														handleSettingChange(
															'security',
															'apiRequestsPerMinute',
															parseInt(
																e.target.value
															)
														)
													}
													min='10'
													max='1000'
													className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
												/>
											</div>
										</div>
									</div>
								)}

								{/* Backups & Export */}
								{activeCategory === 'backups' && (
									<div>
										<TypographyH2 className='mb-6'>
											Backups & Data Export
										</TypographyH2>

										<div className='space-y-8'>
											<div>
												<h3 className='text-lg font-medium mb-2'>
													Database Backup
												</h3>
												<p className='text-muted-foreground text-sm mb-4'>
													Create a backup of your
													database. This includes all
													user data, posts, projects,
													and site settings.
												</p>
												<Button
													type='button'
													variant='outline'
													className='flex items-center gap-2'
													disabled={backupInProgress}
													onClick={handleBackup}
												>
													{backupInProgress ? (
														<>
															<RefreshCcw
																size={16}
																className='animate-spin'
															/>
															Creating Backup...
														</>
													) : (
														<>
															<Download
																size={16}
															/>
															Download Backup
														</>
													)}
												</Button>
											</div>

											<div>
												<h3 className='text-lg font-medium mb-2'>
													Restore from Backup
												</h3>
												<p className='text-muted-foreground text-sm mb-4'>
													Restore your site from a
													previous backup file.
												</p>
												<div>
													<div className='mb-3 flex items-center gap-2'>
														<Button
															type='button'
															variant='outline'
															className='flex items-center gap-2'
															disabled={
																restoreInProgress
															}
														>
															<Upload size={16} />
															Select Backup File
														</Button>

														<span className='text-sm text-muted-foreground'>
															No file selected
														</span>
													</div>

													<Button
														type='button'
														variant='outline'
														className='flex items-center gap-2 text-red-500 border-red-200 hover:bg-red-50'
														disabled={true}
													>
														<AlertTriangle
															size={16}
														/>
														Restore from Backup
													</Button>
												</div>
											</div>

											<div>
												<h3 className='text-lg font-medium mb-2'>
													Export Data
												</h3>
												<p className='text-muted-foreground text-sm mb-4'>
													Export your site data in
													various formats.
												</p>
												<div className='flex flex-wrap gap-3'>
													<Button
														type='button'
														variant='outline'
														className='flex items-center gap-2'
													>
														<FileJson size={16} />
														Export as JSON
													</Button>

													<Button
														type='button'
														variant='outline'
														className='flex items-center gap-2'
													>
														<FileJson size={16} />
														Export Users
													</Button>

													<Button
														type='button'
														variant='outline'
														className='flex items-center gap-2'
													>
														<MessageSquare
															size={16}
														/>
														Export Posts
													</Button>
												</div>
											</div>

											<div className='p-4 bg-red-50 text-red-800 rounded-md border border-red-200'>
												<h3 className='text-md font-medium mb-2 flex items-center gap-2'>
													<AlertTriangle size={16} />
													Danger Zone
												</h3>
												<p className='text-sm mb-4'>
													These actions are
													irreversible and should be
													used with caution.
												</p>
												<div className='flex gap-3'>
													<Button
														type='button'
														variant='outline'
														className='flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50'
														onClick={() => {
															if (
																window.confirm(
																	'Are you sure you want to reset all site settings to default? This cannot be undone.'
																)
															) {
																// Reset logic would go here
															}
														}}
													>
														<RefreshCcw size={16} />
														Reset Settings
													</Button>

													<Button
														type='button'
														variant='outline'
														className='flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50'
														onClick={() => {
															if (
																window.confirm(
																	'Are you sure you want to purge all cached data? This may temporarily slow down your site.'
																)
															) {
																// Cache purge logic would go here
															}
														}}
													>
														<RefreshCcw size={16} />
														Purge Cache
													</Button>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Integrations & APIs */}
								{activeCategory === 'integrations' && (
									<div>
										<TypographyH2 className='mb-6'>
											Integrations & APIs
										</TypographyH2>

										<div className='space-y-8'>
											<div>
												<h3 className='text-lg font-medium mb-2'>
													Email Integration
												</h3>
												<p className='text-muted-foreground text-sm mb-4'>
													Configure your email service
													provider for sending
													notifications.
												</p>
												<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
													<div>
														<label className='block text-sm font-medium mb-1'>
															SMTP Server
														</label>
														<input
															type='text'
															placeholder='smtp.example.com'
															className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
														/>
													</div>

													<div>
														<label className='block text-sm font-medium mb-1'>
															SMTP Port
														</label>
														<input
															type='number'
															placeholder='587'
															className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
														/>
													</div>

													<div>
														<label className='block text-sm font-medium mb-1'>
															Username
														</label>
														<input
															type='text'
															placeholder='user@example.com'
															className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
														/>
													</div>

													<div>
														<label className='block text-sm font-medium mb-1'>
															Password
														</label>
														<input
															type='password'
															placeholder='••••••••••••'
															className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
														/>
													</div>
												</div>
												<div className='mt-3'>
													<Button
														type='button'
														variant='outline'
														className='flex items-center gap-2'
													>
														<Mail size={16} />
														Test Email Connection
													</Button>
												</div>
											</div>

											<div>
												<h3 className='text-lg font-medium mb-2'>
													API Keys
												</h3>
												<p className='text-muted-foreground text-sm mb-4'>
													Manage API keys for external
													integrations.
												</p>
												<div className='space-y-4'>
													<div>
														<label className='block text-sm font-medium mb-1'>
															Google Maps API Key
														</label>
														<div className='flex gap-2'>
															<input
																type='text'
																placeholder='AIza...'
																className='flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
															/>
															<Button
																type='button'
																variant='outline'
																className='shrink-0'
															>
																<Globe
																	size={16}
																/>
															</Button>
														</div>
													</div>

													<div>
														<label className='block text-sm font-medium mb-1'>
															Weather API Key
														</label>
														<div className='flex gap-2'>
															<input
																type='text'
																placeholder='Add your API key'
																className='flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
															/>
															<Button
																type='button'
																variant='outline'
																className='shrink-0'
															>
																<Globe
																	size={16}
																/>
															</Button>
														</div>
													</div>

													<Button
														type='button'
														variant='outline'
														className='flex items-center gap-2'
													>
														<Key size={16} />
														Add New API Integration
													</Button>
												</div>
											</div>

											<div>
												<h3 className='text-lg font-medium mb-2'>
													Webhook URLs
												</h3>
												<p className='text-muted-foreground text-sm mb-4'>
													Configure webhooks to notify
													external services.
												</p>
												<div className='space-y-3'>
													<div>
														<label className='block text-sm font-medium mb-1'>
															New User Webhook
														</label>
														<input
															type='url'
															placeholder='https://example.com/webhook/new-user'
															className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
														/>
													</div>

													<div>
														<label className='block text-sm font-medium mb-1'>
															New Post Webhook
														</label>
														<input
															type='url'
															placeholder='https://example.com/webhook/new-post'
															className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
														/>
													</div>

													<div className='mt-2'>
														<Button
															type='button'
															variant='outline'
															className='flex items-center gap-2'
														>
															<PlaySquare
																size={16}
															/>
															Test Webhook
														</Button>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Save Button - show on all tabs except backups which doesn't need it */}
								{activeCategory !== 'backups' && (
									<div className='mt-8 flex justify-end'>
										<Button
											type='submit'
											className='flex items-center gap-2'
											disabled={isSubmitting}
										>
											{isSubmitting ? (
												<>
													<RefreshCcw
														size={16}
														className='animate-spin'
													/>
													Saving...
												</>
											) : (
												<>
													<Save size={16} />
													Save Settings
												</>
											)}
										</Button>
									</div>
								)}
							</form>
						</div>
					</div>
				</div>
			</div>
		</AdminGuard>
	);
}
