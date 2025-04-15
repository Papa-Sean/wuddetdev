'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/guards/AdminGuard';
import { TypographyH1, TypographyH2 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	User,
	MessageSquare,
	Briefcase,
	Calendar,
	Filter,
	RefreshCcw,
	CheckCircle,
	X,
	AlertCircle,
	Clock,
	ThumbsUp,
	Eye,
	Trash2,
	PenLine,
	ShoppingBag,
} from 'lucide-react';
import { postsApi } from '@/lib/api/posts';
import { projectsApi } from '@/lib/api/projects';
import { contactApi } from '@/lib/api/contact';
import { format, formatDistanceToNow } from 'date-fns';

type ActivityType =
	| 'all'
	| 'user'
	| 'post'
	| 'project'
	| 'message'
	| 'comment'
	| 'merch';
type ActivityStatus = 'all' | 'created' | 'updated' | 'deleted';
type ActivitySorting = 'newest' | 'oldest';

interface Activity {
	id: string;
	type: 'user' | 'post' | 'project' | 'message' | 'comment' | 'merch';
	action: 'created' | 'updated' | 'deleted' | 'viewed' | 'liked';
	entityId: string;
	entityName: string;
	username: string;
	timestamp: string;
	details?: string;
}

export default function AdminActivityPage() {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [filteredActivities, setFilteredActivities] = useState<Activity[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Filter states
	const [typeFilter, setTypeFilter] = useState<ActivityType>('all');
	const [statusFilter, setStatusFilter] = useState<ActivityStatus>('all');
	const [sortDirection, setSortDirection] =
		useState<ActivitySorting>('newest');
	const [searchQuery, setSearchQuery] = useState('');

	// Format date for display
	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			return {
				relative: formatDistanceToNow(date, { addSuffix: true }),
				absolute: format(date, 'MMM d, yyyy h:mm a'),
			};
		} catch (e) {
			return {
				relative: 'Unknown date',
				absolute: 'Invalid timestamp',
			};
		}
	};

	// Fetch activity data
	useEffect(() => {
		async function fetchActivities() {
			setIsLoading(true);
			setError(null);

			try {
				// In a real app, you'd have a dedicated API endpoint for activities
				// For now, we'll create mock activities based on real data

				const [postsData, messagesData, projectsData] =
					await Promise.all([
						postsApi.getPosts(),
						contactApi.getGuestMessages(),
						projectsApi.getProjects(),
					]);

				// Generate activities from posts
				const postActivities: Activity[] = postsData.posts.flatMap(
					(post) => {
						const activities: Activity[] = [
							{
								id: `post-created-${post.id || post._id}`,
								type: 'post',
								action: 'created',
								entityId: post.id || post._id || '',
								entityName: post.title,
								username: post.author?.name || 'Unknown User',
								timestamp: post.createdAt,
								details:
									post.content.substring(0, 50) +
									(post.content.length > 50 ? '...' : ''),
							},
						];

						// Add comment activities
						if (post.comments?.length) {
							post.comments.forEach((comment) => {
								activities.push({
									id: `comment-created-${
										comment.id || comment._id
									}`,
									type: 'comment',
									action: 'created',
									entityId: comment.id || comment._id || '',
									entityName: `Comment on "${post.title}"`,
									username:
										comment.author?.name || 'Unknown User',
									timestamp: comment.createdAt,
									details:
										comment.content.substring(0, 50) +
										(comment.content.length > 50
											? '...'
											: ''),
								});
							});
						}

						return activities;
					}
				);

				// Generate activities from messages
				const messageActivities: Activity[] = messagesData.map(
					(message) => ({
						id: `message-created-${message.id || message._id}`,
						type: 'message',
						action: 'created',
						entityId: message.id || message._id || '',
						entityName: 'Guest Message',
						username: message.name,
						timestamp: message.createdAt,
						details:
							message.message.substring(0, 50) +
							(message.message.length > 50 ? '...' : ''),
					})
				);

				// Generate activities from projects
				const projectActivities: Activity[] = projectsData.map(
					(project) => ({
						id: `project-created-${project.id}`,
						type: 'project',
						action: 'created',
						entityId: project.id || '',
						entityName: project.title,
						username: 'Admin User',
						timestamp: new Date(
							Date.now() - Math.floor(Math.random() * 10000000000)
						).toISOString(),
						details:
							project.description.substring(0, 50) +
							(project.description.length > 50 ? '...' : ''),
					})
				);

				// Mock some random user activities
				const userActivities: Activity[] = [
					{
						id: 'user-created-1',
						type: 'user',
						action: 'created',
						entityId: 'user1',
						entityName: 'New User Account',
						username: 'Sarah Johnson',
						timestamp: new Date(
							Date.now() - 3600000 * 2
						).toISOString(),
						details: 'Registered a new account',
					},
					{
						id: 'user-updated-1',
						type: 'user',
						action: 'updated',
						entityId: 'user2',
						entityName: 'Profile Update',
						username: 'Mike Thomas',
						timestamp: new Date(
							Date.now() - 3600000 * 5
						).toISOString(),
						details: 'Updated profile information',
					},
				];

				// Mock some merch activities
				const merchActivities: Activity[] = [
					{
						id: 'merch-viewed-1',
						type: 'merch',
						action: 'viewed',
						entityId: 'merch1',
						entityName: 'Detroit Dev T-Shirt',
						username: 'Anonymous User',
						timestamp: new Date(Date.now() - 3600000).toISOString(),
						details: 'Viewed product page',
					},
					{
						id: 'merch-liked-1',
						type: 'merch',
						action: 'liked',
						entityId: 'merch2',
						entityName: 'Full Stack Detroit Hoodie',
						username: 'James Wilson',
						timestamp: new Date(Date.now() - 7200000).toISOString(),
						details: 'Added to wishlist',
					},
				];

				// Combine all activities
				const allActivities = [
					...postActivities,
					...messageActivities,
					...projectActivities,
					...userActivities,
					...merchActivities,
				];

				// Sort by timestamp (newest first by default)
				const sortedActivities = allActivities.sort(
					(a, b) =>
						new Date(b.timestamp).getTime() -
						new Date(a.timestamp).getTime()
				);

				setActivities(sortedActivities);
				setFilteredActivities(sortedActivities);
			} catch (err) {
				console.error('Failed to load activities:', err);
				setError('Failed to load activity data. Please try again.');
			} finally {
				setIsLoading(false);
			}
		}

		fetchActivities();
	}, []);

	// Apply filters whenever filter state changes
	useEffect(() => {
		let result = [...activities];

		// Filter by type
		if (typeFilter !== 'all') {
			result = result.filter((activity) => activity.type === typeFilter);
		}

		// Filter by status/action
		if (statusFilter !== 'all') {
			result = result.filter(
				(activity) => activity.action === statusFilter
			);
		}

		// Apply search query
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(activity) =>
					activity.entityName.toLowerCase().includes(query) ||
					activity.username.toLowerCase().includes(query) ||
					(activity.details &&
						activity.details.toLowerCase().includes(query))
			);
		}

		// Apply sorting
		if (sortDirection === 'oldest') {
			result = result.sort(
				(a, b) =>
					new Date(a.timestamp).getTime() -
					new Date(b.timestamp).getTime()
			);
		} else {
			result = result.sort(
				(a, b) =>
					new Date(b.timestamp).getTime() -
					new Date(a.timestamp).getTime()
			);
		}

		setFilteredActivities(result);
	}, [activities, typeFilter, statusFilter, sortDirection, searchQuery]);

	// Reset all filters
	const resetFilters = () => {
		setTypeFilter('all');
		setStatusFilter('all');
		setSortDirection('newest');
		setSearchQuery('');
	};

	// Get icon for activity type
	const getActivityIcon = (activity: Activity) => {
		const iconProps = { size: 16, className: 'mr-1' };

		switch (activity.type) {
			case 'user':
				return <User {...iconProps} />;
			case 'post':
				return <MessageSquare {...iconProps} />;
			case 'comment':
				return <MessageSquare {...iconProps} />;
			case 'project':
				return <Briefcase {...iconProps} />;
			case 'message':
				return <Mail {...iconProps} />;
			case 'merch':
				return <ShoppingBag {...iconProps} />;
			default:
				return <AlertCircle {...iconProps} />;
		}
	};

	// Get icon for activity action
	const getActionIcon = (activity: Activity) => {
		const iconProps = { size: 16, className: 'mr-1' };

		switch (activity.action) {
			case 'created':
				return <PlusCircle {...iconProps} />;
			case 'updated':
				return <PenLine {...iconProps} />;
			case 'deleted':
				return <Trash2 {...iconProps} />;
			case 'viewed':
				return <Eye {...iconProps} />;
			case 'liked':
				return <ThumbsUp {...iconProps} />;
			default:
				return null;
		}
	};

	// Get badge class for activity type
	const getActivityBadgeClasses = (activity: Activity) => {
		let baseClasses =
			'flex items-center text-xs px-2 py-1 rounded-full font-medium';

		switch (activity.type) {
			case 'user':
				return cn(baseClasses, 'bg-blue-50 text-blue-700');
			case 'post':
				return cn(baseClasses, 'bg-green-50 text-green-700');
			case 'comment':
				return cn(baseClasses, 'bg-emerald-50 text-emerald-700');
			case 'project':
				return cn(baseClasses, 'bg-purple-50 text-purple-700');
			case 'message':
				return cn(baseClasses, 'bg-orange-50 text-orange-700');
			case 'merch':
				return cn(baseClasses, 'bg-pink-50 text-pink-700');
			default:
				return cn(baseClasses, 'bg-gray-50 text-gray-700');
		}
	};

	// Get badge class for action type
	const getActionBadgeClasses = (activity: Activity) => {
		let baseClasses =
			'flex items-center text-xs px-2 py-1 rounded-full font-medium';

		switch (activity.action) {
			case 'created':
				return cn(baseClasses, 'bg-green-50 text-green-700');
			case 'updated':
				return cn(baseClasses, 'bg-blue-50 text-blue-700');
			case 'deleted':
				return cn(baseClasses, 'bg-red-50 text-red-700');
			case 'viewed':
				return cn(baseClasses, 'bg-gray-50 text-gray-700');
			case 'liked':
				return cn(baseClasses, 'bg-pink-50 text-pink-700');
			default:
				return cn(baseClasses, 'bg-gray-50 text-gray-700');
		}
	};

	return (
		<AdminGuard>
			<div className='container mx-auto px-4 py-8'>
				<div className='mb-8'>
					<TypographyH1>Activity Log</TypographyH1>
					<p className='text-muted-foreground'>
						Track all platform activities from users, posts,
						projects and more
					</p>
				</div>

				{/* Filters Section */}
				<div className='mb-8 bg-card rounded-lg shadow-sm border border-border p-6'>
					<div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4'>
						<TypographyH2 className='mb-4 md:mb-0'>
							Filters
						</TypographyH2>
						<Button
							variant='outline'
							size='sm'
							onClick={resetFilters}
							className='flex items-center gap-1'
						>
							<RefreshCcw size={14} />
							Reset Filters
						</Button>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
						{/* Type Filter */}
						<div>
							<label className='block text-sm font-medium mb-2'>
								Activity Type
							</label>
							<select
								value={typeFilter}
								onChange={(e) =>
									setTypeFilter(
										e.target.value as ActivityType
									)
								}
								className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
							>
								<option value='all'>All Types</option>
								<option value='user'>User Activities</option>
								<option value='post'>Posts</option>
								<option value='comment'>Comments</option>
								<option value='project'>Projects</option>
								<option value='message'>Messages</option>
								<option value='merch'>Merchandise</option>
							</select>
						</div>

						{/* Status Filter */}
						<div>
							<label className='block text-sm font-medium mb-2'>
								Activity Status
							</label>
							<select
								value={statusFilter}
								onChange={(e) =>
									setStatusFilter(
										e.target.value as ActivityStatus
									)
								}
								className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
							>
								<option value='all'>All Actions</option>
								<option value='created'>Created</option>
								<option value='updated'>Updated</option>
								<option value='deleted'>Deleted</option>
							</select>
						</div>

						{/* Sort Direction */}
						<div>
							<label className='block text-sm font-medium mb-2'>
								Sort By
							</label>
							<select
								value={sortDirection}
								onChange={(e) =>
									setSortDirection(
										e.target.value as ActivitySorting
									)
								}
								className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
							>
								<option value='newest'>Newest First</option>
								<option value='oldest'>Oldest First</option>
							</select>
						</div>

						{/* Search */}
						<div>
							<label className='block text-sm font-medium mb-2'>
								Search
							</label>
							<input
								type='text'
								placeholder='Search activities...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
							/>
						</div>
					</div>
				</div>

				{/* Activities List */}
				<div className='bg-card rounded-lg shadow-sm border border-border'>
					{isLoading ? (
						<div className='flex justify-center items-center h-64'>
							<div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full'></div>
						</div>
					) : error ? (
						<div className='p-8 text-center'>
							<AlertCircle className='w-12 h-12 mx-auto mb-4 text-red-500' />
							<p className='text-lg font-medium text-red-500'>
								{error}
							</p>
							<Button
								onClick={() => window.location.reload()}
								variant='outline'
								className='mt-4'
							>
								Try Again
							</Button>
						</div>
					) : filteredActivities.length === 0 ? (
						<div className='p-8 text-center'>
							<Filter className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
							<p className='text-lg font-medium'>
								No activities match your filters
							</p>
							<Button
								onClick={resetFilters}
								variant='outline'
								className='mt-4'
							>
								Clear Filters
							</Button>
						</div>
					) : (
						<ul className='divide-y divide-border'>
							{filteredActivities.map((activity) => {
								const formattedDate = formatDate(
									activity.timestamp
								);
								return (
									<li
										key={activity.id}
										className='p-4 hover:bg-muted/30 transition-colors'
									>
										<div className='flex flex-col sm:flex-row sm:items-center justify-between'>
											<div className='flex-1 mb-2 sm:mb-0'>
												<div className='flex flex-wrap gap-2 mb-2'>
													<span
														className={getActivityBadgeClasses(
															activity
														)}
													>
														{getActivityIcon(
															activity
														)}
														{activity.type
															.charAt(0)
															.toUpperCase() +
															activity.type.slice(
																1
															)}
													</span>
													<span
														className={getActionBadgeClasses(
															activity
														)}
													>
														{getActionIcon(
															activity
														)}
														{activity.action
															.charAt(0)
															.toUpperCase() +
															activity.action.slice(
																1
															)}
													</span>
												</div>

												<h3 className='text-base font-medium'>
													{activity.entityName}
												</h3>
												{activity.details && (
													<p className='text-muted-foreground text-sm mt-1'>
														{activity.details}
													</p>
												)}
												<p className='text-sm text-primary mt-1'>
													by {activity.username}
												</p>
											</div>

											<div className='text-right text-sm text-muted-foreground flex sm:flex-col items-center sm:items-end gap-1 sm:gap-0'>
												<span className='flex items-center'>
													<Clock
														size={14}
														className='mr-1'
													/>
													{formattedDate.relative}
												</span>
												<span className='text-xs'>
													{formattedDate.absolute}
												</span>
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					)}

					{/* Pagination (if needed) */}
					<div className='flex justify-between items-center p-4 border-t border-border'>
						<p className='text-sm text-muted-foreground'>
							Showing {filteredActivities.length} of{' '}
							{activities.length} activities
						</p>
						<div className='flex gap-2'>
							<Button
								variant='outline'
								size='sm'
								disabled
							>
								Previous
							</Button>
							<Button
								variant='outline'
								size='sm'
								disabled
							>
								Next
							</Button>
						</div>
					</div>
				</div>
			</div>
		</AdminGuard>
	);
}

// Include these icons if not available
const Mail = (props: any) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
		{...props}
	>
		<rect
			width='20'
			height='16'
			x='2'
			y='4'
			rx='2'
		/>
		<path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
	</svg>
);

const PlusCircle = (props: any) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
		{...props}
	>
		<circle
			cx='12'
			cy='12'
			r='10'
		/>
		<path d='M8 12h8' />
		<path d='M12 8v8' />
	</svg>
);
