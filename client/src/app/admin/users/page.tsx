'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/guards/AdminGuard';
import { TypographyH1, TypographyH2 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
	Search,
	Filter,
	RefreshCw,
	UserPlus,
	MoreHorizontal,
	Shield,
	ShieldAlert,
	UserX,
	Mail,
	CheckCircle,
	XCircle,
	AlertTriangle,
} from 'lucide-react';

// Mock user data for development and testing
const mockUsers = [
	{
		id: '1',
		name: 'John Smith',
		email: 'john.smith@example.com',
		role: 'member',
		location: 'Detroit',
		status: 'active',
		lastActive: '2025-04-10T15:30:00Z',
		joinDate: '2024-02-15T10:20:00Z',
		profileImage: '',
	},
	{
		id: '2',
		name: 'Sarah Johnson',
		email: 'sarah.johnson@example.com',
		role: 'member',
		location: 'Ann Arbor',
		status: 'active',
		lastActive: '2025-04-14T09:45:00Z',
		joinDate: '2024-03-22T14:30:00Z',
		profileImage: '',
	},
	{
		id: '3',
		name: 'Admin User',
		email: 'admin@wuddetdev.com',
		role: 'admin',
		location: 'Detroit',
		status: 'active',
		lastActive: '2025-04-14T11:20:00Z',
		joinDate: '2024-01-10T08:15:00Z',
		profileImage: '',
	},
	{
		id: '4',
		name: 'Michael Thomas',
		email: 'michael.thomas@example.com',
		role: 'member',
		location: 'Grand Rapids',
		status: 'inactive',
		lastActive: '2025-03-02T16:45:00Z',
		joinDate: '2024-02-28T11:10:00Z',
		profileImage: '',
	},
	{
		id: '5',
		name: 'Jessica Williams',
		email: 'jessica.williams@example.com',
		role: 'member',
		location: 'Lansing',
		status: 'pending',
		lastActive: null,
		joinDate: '2025-04-12T13:40:00Z',
		profileImage: '',
	},
	{
		id: '6',
		name: 'David Brown',
		email: 'david.brown@example.com',
		role: 'member',
		location: 'Detroit',
		status: 'active',
		lastActive: '2025-04-13T10:15:00Z',
		joinDate: '2024-01-20T09:30:00Z',
		profileImage: '',
	},
	{
		id: '7',
		name: 'Lisa Garcia',
		email: 'lisa.garcia@example.com',
		role: 'member',
		location: 'Ann Arbor',
		status: 'active',
		lastActive: '2025-04-11T14:20:00Z',
		joinDate: '2024-03-05T15:45:00Z',
		profileImage: '',
	},
];

type UserRole = 'admin' | 'member';
type UserStatus = 'active' | 'inactive' | 'pending' | 'banned';
type SortField =
	| 'name'
	| 'email'
	| 'role'
	| 'location'
	| 'status'
	| 'joinDate'
	| 'lastActive';
type SortOrder = 'asc' | 'desc';

interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	location: string;
	status: UserStatus;
	lastActive: string | null;
	joinDate: string;
	profileImage: string;
}

export default function UsersPage() {
	// States
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Filter states
	const [searchQuery, setSearchQuery] = useState('');
	const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
	const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
	const [locationFilter, setLocationFilter] = useState('all');
	const [sortField, setSortField] = useState<SortField>('joinDate');
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

	// UI states
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [actionType, setActionType] = useState<string | null>(null);

	// Fetch users data
	useEffect(() => {
		async function fetchUsers() {
			setIsLoading(true);
			setError(null);

			try {
				// In production, replace with actual API call
				// const response = await fetch('/api/admin/users');
				// const data = await response.json();
				// setUsers(data);

				// Using mock data for development
				setTimeout(() => {
					setUsers(mockUsers as User[]);
					setIsLoading(false);
				}, 800); // Simulate loading
			} catch (err) {
				console.error('Failed to load users:', err);
				setError('Failed to load users data. Please try again.');
				setIsLoading(false);
			}
		}

		fetchUsers();
	}, []);

	// Apply filters when dependencies change
	useEffect(() => {
		let result = [...users];

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(user) =>
					user.name.toLowerCase().includes(query) ||
					user.email.toLowerCase().includes(query)
			);
		}

		// Apply role filter
		if (roleFilter !== 'all') {
			result = result.filter((user) => user.role === roleFilter);
		}

		// Apply status filter
		if (statusFilter !== 'all') {
			result = result.filter((user) => user.status === statusFilter);
		}

		// Apply location filter
		if (locationFilter !== 'all') {
			result = result.filter((user) => user.location === locationFilter);
		}

		// Apply sorting
		result.sort((a, b) => {
			const fieldA = a[sortField];
			const fieldB = b[sortField];

			// Handle null values
			if (fieldA === null && fieldB !== null) return 1;
			if (fieldA !== null && fieldB === null) return -1;
			if (fieldA === null && fieldB === null) return 0;

			// Sort based on field type
			if (sortField === 'joinDate' || sortField === 'lastActive') {
				const dateA = fieldA ? new Date(fieldA as string).getTime() : 0;
				const dateB = fieldB ? new Date(fieldB as string).getTime() : 0;
				return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
			}

			// String comparison
			const strA = String(fieldA).toLowerCase();
			const strB = String(fieldB).toLowerCase();
			return sortOrder === 'asc'
				? strA.localeCompare(strB)
				: strB.localeCompare(strA);
		});

		setFilteredUsers(result);
	}, [
		users,
		searchQuery,
		roleFilter,
		statusFilter,
		locationFilter,
		sortField,
		sortOrder,
	]);

	// Get unique locations for filter dropdown
	const locations = ['all', ...new Set(users.map((user) => user.location))];

	// Format date
	const formatDate = (dateString: string | null) => {
		if (!dateString) return 'Never';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		}).format(date);
	};

	// Format time ago
	const getTimeAgo = (dateString: string | null) => {
		if (!dateString) return 'Never';

		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 30) return `${diffDays} days ago`;

		const diffMonths = Math.floor(diffDays / 30);
		return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
	};

	// Toggle user selection
	const toggleSelectUser = (userId: string) => {
		setSelectedUsers((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId]
		);
	};

	// Select all users
	const toggleSelectAll = () => {
		setSelectedUsers((prev) =>
			prev.length === filteredUsers.length
				? []
				: filteredUsers.map((user) => user.id)
		);
	};

	// Handle bulk actions
	const handleBulkAction = (action: string) => {
		setActionType(action);
		setShowConfirmDialog(true);
	};

	// Execute bulk action after confirmation
	const confirmBulkAction = async () => {
		if (!actionType || selectedUsers.length === 0) return;

		try {
			// In production, implement actual API calls
			console.log(`Performing ${actionType} on users:`, selectedUsers);

			// Update UI optimistically
			switch (actionType) {
				case 'promote':
					setUsers((prev) =>
						prev.map((user) =>
							selectedUsers.includes(user.id)
								? { ...user, role: 'admin' as UserRole }
								: user
						)
					);
					break;
				case 'demote':
					setUsers((prev) =>
						prev.map((user) =>
							selectedUsers.includes(user.id)
								? { ...user, role: 'member' as UserRole }
								: user
						)
					);
					break;
				case 'activate':
					setUsers((prev) =>
						prev.map((user) =>
							selectedUsers.includes(user.id)
								? { ...user, status: 'active' as UserStatus }
								: user
						)
					);
					break;
				case 'deactivate':
					setUsers((prev) =>
						prev.map((user) =>
							selectedUsers.includes(user.id)
								? { ...user, status: 'inactive' as UserStatus }
								: user
						)
					);
					break;
				case 'delete':
					setUsers((prev) =>
						prev.filter((user) => !selectedUsers.includes(user.id))
					);
					break;
			}

			// Reset selection
			setSelectedUsers([]);
		} catch (error) {
			console.error(`Error performing ${actionType}:`, error);
		} finally {
			setShowConfirmDialog(false);
			setActionType(null);
		}
	};

	// Reset all filters
	const resetFilters = () => {
		setSearchQuery('');
		setRoleFilter('all');
		setStatusFilter('all');
		setLocationFilter('all');
		setSortField('joinDate');
		setSortOrder('desc');
	};

	// UI rendering
	return (
		<AdminGuard>
			<div className='container mx-auto px-4 py-8'>
				<div className='mb-8 flex justify-between items-center'>
					<div>
						<TypographyH1>User Management</TypographyH1>
						<p className='text-muted-foreground'>
							Manage user accounts, roles, and permissions
						</p>
					</div>

					<Button
						onClick={() => {}}
						className='flex items-center gap-2'
					>
						<UserPlus size={16} />
						Add User
					</Button>
				</div>

				{/* Stats Section */}
				<section className='mb-8 grid grid-cols-1 md:grid-cols-4 gap-4'>
					<div className='bg-card p-4 rounded-lg shadow-sm border border-border'>
						<p className='text-muted-foreground text-sm'>
							Total Users
						</p>
						<p className='text-3xl font-bold'>
							{isLoading ? '—' : users.length}
						</p>
					</div>
					<div className='bg-card p-4 rounded-lg shadow-sm border border-border'>
						<p className='text-muted-foreground text-sm'>
							Active Users
						</p>
						<p className='text-3xl font-bold'>
							{isLoading
								? '—'
								: users.filter((u) => u.status === 'active')
										.length}
						</p>
					</div>
					<div className='bg-card p-4 rounded-lg shadow-sm border border-border'>
						<p className='text-muted-foreground text-sm'>Admins</p>
						<p className='text-3xl font-bold'>
							{isLoading
								? '—'
								: users.filter((u) => u.role === 'admin')
										.length}
						</p>
					</div>
					<div className='bg-card p-4 rounded-lg shadow-sm border border-border'>
						<p className='text-muted-foreground text-sm'>
							Pending Approval
						</p>
						<p className='text-3xl font-bold'>
							{isLoading
								? '—'
								: users.filter((u) => u.status === 'pending')
										.length}
						</p>
					</div>
				</section>

				{/* Filters Section */}
				<section className='mb-6 bg-card rounded-lg shadow-sm border border-border p-6'>
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
							<RefreshCw size={14} />
							Reset Filters
						</Button>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
						{/* Search */}
						<div className='relative'>
							<Search
								className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'
								size={18}
							/>
							<input
								type='text'
								placeholder='Search users...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='pl-10 px-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
							/>
						</div>

						{/* Role Filter */}
						<div>
							<select
								value={roleFilter}
								onChange={(e) =>
									setRoleFilter(
										e.target.value as UserRole | 'all'
									)
								}
								className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
							>
								<option value='all'>All Roles</option>
								<option value='admin'>Admins</option>
								<option value='member'>Members</option>
							</select>
						</div>

						{/* Status Filter */}
						<div>
							<select
								value={statusFilter}
								onChange={(e) =>
									setStatusFilter(
										e.target.value as UserStatus | 'all'
									)
								}
								className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
							>
								<option value='all'>All Statuses</option>
								<option value='active'>Active</option>
								<option value='inactive'>Inactive</option>
								<option value='pending'>Pending</option>
								<option value='banned'>Banned</option>
							</select>
						</div>

						{/* Location Filter */}
						<div>
							<select
								value={locationFilter}
								onChange={(e) =>
									setLocationFilter(e.target.value)
								}
								className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
							>
								<option value='all'>All Locations</option>
								{locations
									.filter((loc) => loc !== 'all')
									.map((location) => (
										<option
											key={location}
											value={location}
										>
											{location}
										</option>
									))}
							</select>
						</div>

						{/* Sort By */}
						<div className='flex gap-2'>
							<select
								value={sortField}
								onChange={(e) =>
									setSortField(e.target.value as SortField)
								}
								className='flex-grow px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
							>
								<option value='name'>Name</option>
								<option value='email'>Email</option>
								<option value='role'>Role</option>
								<option value='location'>Location</option>
								<option value='status'>Status</option>
								<option value='joinDate'>Join Date</option>
								<option value='lastActive'>Last Active</option>
							</select>

							<Button
								variant='outline'
								size='icon'
								onClick={() =>
									setSortOrder((prev) =>
										prev === 'asc' ? 'desc' : 'asc'
									)
								}
								title={
									sortOrder === 'asc'
										? 'Ascending'
										: 'Descending'
								}
							>
								{sortOrder === 'asc' ? '↑' : '↓'}
							</Button>
						</div>
					</div>
				</section>

				{/* Bulk Actions */}
				{selectedUsers.length > 0 && (
					<div className='mb-4 p-4 bg-muted rounded-lg flex flex-wrap gap-2 items-center justify-between'>
						<span className='text-sm font-medium'>
							{selectedUsers.length}{' '}
							{selectedUsers.length === 1 ? 'user' : 'users'}{' '}
							selected
						</span>
						<div className='flex flex-wrap gap-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => handleBulkAction('promote')}
								className='flex items-center gap-1'
							>
								<ShieldAlert size={14} />
								Make Admin
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => handleBulkAction('demote')}
								className='flex items-center gap-1'
							>
								<Shield size={14} />
								Make Member
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => handleBulkAction('activate')}
								className='flex items-center gap-1'
							>
								<CheckCircle size={14} />
								Activate
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => handleBulkAction('deactivate')}
								className='flex items-center gap-1'
							>
								<XCircle size={14} />
								Deactivate
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => handleBulkAction('email')}
								className='flex items-center gap-1'
							>
								<Mail size={14} />
								Email
							</Button>
							<Button
								variant='destructive'
								size='sm'
								onClick={() => handleBulkAction('delete')}
								className='flex items-center gap-1'
							>
								<UserX size={14} />
								Delete
							</Button>
						</div>
					</div>
				)}

				{/* Users Table */}
				<div className='bg-card rounded-lg shadow-sm border border-border overflow-hidden'>
					{isLoading ? (
						<div className='flex justify-center items-center h-64'>
							<div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full'></div>
						</div>
					) : error ? (
						<div className='p-8 text-center'>
							<AlertTriangle className='w-12 h-12 mx-auto mb-4 text-red-500' />
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
					) : filteredUsers.length === 0 ? (
						<div className='p-8 text-center'>
							<Filter className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
							<p className='text-lg font-medium'>
								No users match your filters
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
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead className='bg-muted/50 text-left'>
									<tr>
										<th className='px-6 py-3'>
											<input
												type='checkbox'
												checked={
													selectedUsers.length ===
														filteredUsers.length &&
													filteredUsers.length > 0
												}
												onChange={toggleSelectAll}
												className='w-4 h-4 rounded border-gray-300'
											/>
										</th>
										<th className='px-6 py-3 font-medium'>
											User
										</th>
										<th className='px-6 py-3 font-medium'>
											Email
										</th>
										<th className='px-6 py-3 font-medium'>
											Role
										</th>
										<th className='px-6 py-3 font-medium'>
											Location
										</th>
										<th className='px-6 py-3 font-medium'>
											Status
										</th>
										<th className='px-6 py-3 font-medium'>
											Joined
										</th>
										<th className='px-6 py-3 font-medium'>
											Last Active
										</th>
										<th className='px-6 py-3 font-medium'>
											Actions
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-border'>
									{filteredUsers.map((user) => (
										<tr
											key={user.id}
											className='hover:bg-muted/30 transition-colors'
										>
											<td className='px-6 py-4'>
												<input
													type='checkbox'
													checked={selectedUsers.includes(
														user.id
													)}
													onChange={() =>
														toggleSelectUser(
															user.id
														)
													}
													className='w-4 h-4 rounded border-gray-300'
												/>
											</td>
											<td className='px-6 py-4'>
												<div className='flex items-center gap-3'>
													<Avatar className='h-8 w-8'>
														<AvatarImage
															src={
																user.profileImage
															}
														/>
														<AvatarFallback>
															{user.name.substring(
																0,
																2
															)}
														</AvatarFallback>
													</Avatar>
													<span className='font-medium'>
														{user.name}
													</span>
												</div>
											</td>
											<td className='px-6 py-4 text-sm text-muted-foreground'>
												{user.email}
											</td>
											<td className='px-6 py-4'>
												<span
													className={cn(
														'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
														user.role === 'admin'
															? 'bg-primary/20 text-primary'
															: 'bg-muted text-muted-foreground'
													)}
												>
													{user.role === 'admin' ? (
														<ShieldAlert
															size={12}
															className='mr-1'
														/>
													) : (
														<Shield
															size={12}
															className='mr-1'
														/>
													)}
													{user.role
														.charAt(0)
														.toUpperCase() +
														user.role.slice(1)}
												</span>
											</td>
											<td className='px-6 py-4 text-sm'>
												{user.location}
											</td>
											<td className='px-6 py-4'>
												<span
													className={cn(
														'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
														user.status ===
															'active' &&
															'bg-green-50 text-green-700',
														user.status ===
															'inactive' &&
															'bg-gray-100 text-gray-700',
														user.status ===
															'pending' &&
															'bg-amber-50 text-amber-700',
														user.status ===
															'banned' &&
															'bg-red-50 text-red-700'
													)}
												>
													{user.status ===
														'active' && (
														<CheckCircle
															size={12}
															className='mr-1'
														/>
													)}
													{user.status ===
														'inactive' && (
														<XCircle
															size={12}
															className='mr-1'
														/>
													)}
													{user.status ===
														'pending' && (
														<AlertTriangle
															size={12}
															className='mr-1'
														/>
													)}
													{user.status ===
														'banned' && (
														<UserX
															size={12}
															className='mr-1'
														/>
													)}
													{user.status
														.charAt(0)
														.toUpperCase() +
														user.status.slice(1)}
												</span>
											</td>
											<td className='px-6 py-4 text-sm'>
												<div className='flex flex-col'>
													<span>
														{formatDate(
															user.joinDate
														)}
													</span>
													<span className='text-xs text-muted-foreground'>
														{getTimeAgo(
															user.joinDate
														)}
													</span>
												</div>
											</td>
											<td className='px-6 py-4 text-sm'>
												<div className='flex flex-col'>
													<span>
														{formatDate(
															user.lastActive
														)}
													</span>
													<span className='text-xs text-muted-foreground'>
														{getTimeAgo(
															user.lastActive
														)}
													</span>
												</div>
											</td>
											<td className='px-6 py-4'>
												<div className='flex items-center'>
													<Button
														variant='ghost'
														size='icon'
													>
														<MoreHorizontal
															size={16}
														/>
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{/* Pagination */}
					<div className='px-6 py-4 border-t border-border flex justify-between items-center'>
						<span className='text-sm text-muted-foreground'>
							Showing {filteredUsers.length} of {users.length}{' '}
							users
						</span>
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

				{/* Confirmation Dialog */}
				{showConfirmDialog && (
					<div className='fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50'>
						<div className='bg-card p-6 rounded-lg shadow-lg max-w-md w-full'>
							<h3 className='text-lg font-bold mb-2'>
								Confirm Action
							</h3>
							<p className='mb-4'>
								Are you sure you want to {actionType}{' '}
								{selectedUsers.length}{' '}
								{selectedUsers.length === 1 ? 'user' : 'users'}?
							</p>
							<div className='flex justify-end gap-2'>
								<Button
									variant='outline'
									onClick={() => setShowConfirmDialog(false)}
								>
									Cancel
								</Button>
								<Button
									variant={
										actionType === 'delete'
											? 'destructive'
											: 'default'
									}
									onClick={confirmBulkAction}
								>
									Confirm
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</AdminGuard>
	);
}
