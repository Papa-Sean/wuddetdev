'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/guards/AdminGuard';
import { TypographyH1, TypographyH2 } from '@/components/ui/typography';
import { fetchSiteStats } from '@/lib/api/stats';
import { postsApi } from '@/lib/api/posts';
import { projectsApi } from '@/lib/api/projects';
import { contactApi } from '@/lib/api/contact';
import {
	Users,
	MessageSquare,
	Briefcase,
	ShoppingBag,
	Settings,
	Activity,
	Sliders,
	BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StatsCard {
	title: string;
	value: number | string;
	icon: React.ReactNode;
	description: string;
	color: 'primary' | 'secondary' | 'accent' | 'muted';
}

export default function AdminPage() {
	const [activeUsers, setActiveUsers] = useState<number>(0);
	const [totalPosts, setTotalPosts] = useState<number>(0);
	const [totalProjects, setTotalProjects] = useState<number>(0);
	const [pendingMessages, setPendingMessages] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		async function loadAdminData() {
			setIsLoading(true);
			try {
				// Fetch all the data in parallel
				const [stats, postsData, messagesData] = await Promise.all([
					fetchSiteStats(),
					postsApi.getPosts(),
					contactApi.getGuestMessages(),
				]);

				setActiveUsers(stats.activeUsers);
				setTotalPosts(postsData.posts.length);
				setTotalProjects(stats.projects);

				// Filter for unresponded messages
				const pending = messagesData.filter(
					(msg) => !msg.isResponded
				).length;
				setPendingMessages(pending);
			} catch (error) {
				console.error('Failed to load admin dashboard data:', error);
			} finally {
				setIsLoading(false);
			}
		}

		loadAdminData();
	}, []);

	// Stats cards data
	const statsCards: StatsCard[] = [
		{
			title: 'Active Users',
			value: activeUsers,
			icon: <Users className='h-6 w-6' />,
			description: 'Total registered members',
			color: 'primary',
		},
		{
			title: 'Community Posts',
			value: totalPosts,
			icon: <MessageSquare className='h-6 w-6' />,
			description: 'Posts and events',
			color: 'secondary',
		},
		{
			title: 'Projects',
			value: totalProjects,
			icon: <Briefcase className='h-6 w-6' />,
			description: 'Portfolio showcase',
			color: 'accent',
		},
		{
			title: 'Pending Messages',
			value: pendingMessages,
			icon: <MessageSquare className='h-6 w-6' />,
			description: 'Awaiting response',
			color: 'muted',
		},
	];

	// Admin sections data
	const adminSections = [
		{
			title: 'User Management',
			description: 'Manage user accounts, roles and permissions',
			icon: <Users size={24} />,
			href: '/admin/users',
			color: 'bg-blue-50 text-blue-600',
		},
		{
			title: 'Content Management',
			description: 'Manage posts, comments and projects',
			icon: <MessageSquare size={24} />,
			href: '/admin/content',
			color: 'bg-green-50 text-green-600',
		},
		{
			title: 'Analytics',
			description: 'View site traffic and engagement metrics',
			icon: <BarChart3 size={24} />,
			href: '/admin/analytics',
			color: 'bg-purple-50 text-purple-600',
		},
		{
			title: 'Settings',
			description: 'Configure site settings and preferences',
			icon: <Settings size={24} />,
			href: '/admin/settings',
			color: 'bg-orange-50 text-orange-600',
		},
	];

	return (
		<AdminGuard>
			<div className='container mx-auto px-4 py-8'>
				<div className='mb-8'>
					<TypographyH1>Admin Dashboard</TypographyH1>
					<p className='text-muted-foreground'>
						Manage your wuddetdev community and content
					</p>
				</div>

				{/* Stats Section */}
				<section className='mb-12'>
					<TypographyH2 className='mb-6'>Site Overview</TypographyH2>

					{isLoading ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className='h-32 bg-muted/30 animate-pulse rounded-lg'
								></div>
							))}
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
							{statsCards.map((card, i) => (
								<div
									key={i}
									className={cn(
										'bg-card p-6 rounded-lg shadow-sm border-l-4',
										card.color === 'primary' &&
											'border-primary',
										card.color === 'secondary' &&
											'border-secondary',
										card.color === 'accent' &&
											'border-accent',
										card.color === 'muted' &&
											'border-muted-foreground'
									)}
								>
									<div className='flex items-center justify-between mb-4'>
										<h3 className='font-medium'>
											{card.title}
										</h3>
										<div
											className={cn(
												'p-2 rounded-full',
												card.color === 'primary' &&
													'bg-primary/10 text-primary',
												card.color === 'secondary' &&
													'bg-secondary/10 text-secondary',
												card.color === 'accent' &&
													'bg-accent/10 text-accent',
												card.color === 'muted' &&
													'bg-muted text-muted-foreground'
											)}
										>
											{card.icon}
										</div>
									</div>
									<p className='text-3xl font-bold mb-1'>
										{typeof card.value === 'number'
											? card.value.toLocaleString()
											: card.value}
									</p>
									<p className='text-sm text-muted-foreground'>
										{card.description}
									</p>
								</div>
							))}
						</div>
					)}
				</section>

				{/* Quick Access Sections */}
				<section className='mb-12'>
					<TypographyH2 className='mb-6'>Admin Tools</TypographyH2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{adminSections.map((section, i) => (
							<Link
								href={section.href}
								key={i}
							>
								<div className='bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border hover:border-primary/30 h-full'>
									<div
										className={`${section.color} p-3 rounded-lg w-fit mb-4`}
									>
										{section.icon}
									</div>
									<h3 className='font-medium mb-2'>
										{section.title}
									</h3>
									<p className='text-sm text-muted-foreground'>
										{section.description}
									</p>
								</div>
							</Link>
						))}
					</div>
				</section>

				{/* Recent Activity */}
				<section className='mb-12'>
					<div className='flex items-center justify-between mb-6'>
						<TypographyH2>Recent Activity</TypographyH2>
						<Link
							href='/admin/activity'
							className='text-sm text-primary hover:underline flex items-center gap-1'
						>
							View all <Activity size={14} />
						</Link>
					</div>

					<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
						<div className='space-y-4'>
							<ActivityItem
								title='New user registered'
								description='Sarah Johnson just signed up for a new account'
								time='5 minutes ago'
								icon={<Users size={14} />}
								color='bg-blue-50 text-blue-600'
							/>
							<ActivityItem
								title='New community post'
								description='React Workshop event posted by Mike Thomas'
								time='2 hours ago'
								icon={<MessageSquare size={14} />}
								color='bg-green-50 text-green-600'
							/>
							<ActivityItem
								title='Project updated'
								description='Weather Alert System project was updated'
								time='Yesterday'
								icon={<Briefcase size={14} />}
								color='bg-purple-50 text-purple-600'
							/>
							<ActivityItem
								title='New guest message'
								description='New contact request from Daniel Lewis'
								time='2 days ago'
								icon={<MessageSquare size={14} />}
								color='bg-orange-50 text-orange-600'
							/>
						</div>
					</div>
				</section>

				{/* System Info */}
				<section>
					<TypographyH2 className='mb-6'>
						System Information
					</TypographyH2>
					<div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							<SystemInfoItem
								label='Application Version'
								value='1.0.0'
							/>
							<SystemInfoItem
								label='Environment'
								value='Production'
							/>
							<SystemInfoItem
								label='Next.js Version'
								value='15.3.0'
							/>
							<SystemInfoItem
								label='Database Status'
								value='Connected'
								status='online'
							/>
							<SystemInfoItem
								label='Last Backup'
								value='Today, 03:00 AM'
							/>
							<SystemInfoItem
								label='Storage Usage'
								value='42%'
							/>
						</div>
					</div>
				</section>
			</div>
		</AdminGuard>
	);
}

// Helper Components
function ActivityItem({
	title,
	description,
	time,
	icon,
	color,
}: {
	title: string;
	description: string;
	time: string;
	icon: React.ReactNode;
	color: string;
}) {
	return (
		<div className='flex items-start gap-4 p-3 hover:bg-muted/20 rounded-md transition-colors'>
			<div className={`${color} p-2 rounded-full`}>{icon}</div>
			<div className='flex-1'>
				<h4 className='font-medium'>{title}</h4>
				<p className='text-sm text-muted-foreground'>{description}</p>
			</div>
			<span className='text-xs text-muted-foreground whitespace-nowrap'>
				{time}
			</span>
		</div>
	);
}

function SystemInfoItem({
	label,
	value,
	status,
}: {
	label: string;
	value: string;
	status?: 'online' | 'offline' | 'warning';
}) {
	return (
		<div className='flex flex-col'>
			<span className='text-sm text-muted-foreground'>{label}</span>
			<div className='flex items-center gap-2'>
				<span className='font-medium'>{value}</span>
				{status && (
					<span
						className={cn(
							'w-2 h-2 rounded-full',
							status === 'online' && 'bg-green-500',
							status === 'offline' && 'bg-red-500',
							status === 'warning' && 'bg-yellow-500'
						)}
					></span>
				)}
			</div>
		</div>
	);
}
