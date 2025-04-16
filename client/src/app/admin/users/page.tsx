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
	_id?: string; // MongoDB might return _id
	name: string;
	email: string;
	role: UserRole;
	location: string;
	status: UserStatus;
	lastActive: string | null;
	joinDate?: string;
	createdAt?: string; // API might return createdAt instead of joinDate
	profileImage?: string;
	profilePic?: string; // API might use this field instead
}

const getMockUsers = (): User[] => {
	return [
		{
			id: '1',
			name: 'John Doe',
			email: 'john@example.com',
			role: 'admin' as UserRole,
			location: 'Detroit',
			status: 'active' as UserStatus,
			lastActive: new Date().toISOString(),
			joinDate: '2023-01-15T00:00:00Z',
			profileImage: '',
		},
		// Other mock users...
	];
};

// Base URL for API requests
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function for authenticated API requests
async function apiFetch(endpoint: string, options: RequestInit = {}) {
	let token = null;

	// Only access localStorage in browser environment
	if (typeof window !== 'undefined') {
		token = localStorage.getItem('auth_token');
	}

	const headers = {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
		...options.headers,
	};

	console.log(`Fetching from: ${API_URL}${endpoint}`);

	try {
		const response = await fetch(`${API_URL}${endpoint}`, {
			...options,
			headers,
			credentials: 'include',
		});

		// Handle no content responses
		if (response.status === 204) {
			return null;
		}

		const data = await response.json();

		if (!response.ok) {
			console.error('API error:', data);
			throw new Error(
				data.message ||
					`Error ${response.status}: ${response.statusText}`
			);
		}

		return data;
	} catch (error) {
		console.error(`API fetch error for ${endpoint}:`, error);
		throw error;
	}
}

// API Client for User Management
const userApi = {
	getUsers: async (): Promise<User[]> => {
		try {
			const data = await apiFetch('/admin/users');
			return data;
		} catch (error) {
			console.error('Failed to fetch users:', error);
			// Still fall back to mock data if needed
			return getMockUsers();
		}
	},

	updateUserRole: async (userId: string, role: UserRole): Promise<User> => {
		try {
			const data = await apiFetch(`/admin/users/${userId}/role`, {
				method: 'PUT',
				body: JSON.stringify({ role }),
			});
			return data;
		} catch (error) {
			console.error('Failed to update role:', error);
			throw error;
		}
	},

	updateUserStatus: async (
		userId: string,
		status: UserStatus
	): Promise<User> => {
		try {
			const data = await apiFetch(`/admin/users/${userId}/status`, {
				method: 'PUT',
				body: JSON.stringify({ status }),
			});
			return data;
		} catch (error) {
			console.error('Failed to update status:', error);
			throw error;
		}
	},

	deleteUser: async (userId: string): Promise<void> => {
		await apiFetch(`/admin/users/${userId}`, {
			method: 'DELETE',
		});
	},
};

export default function UsersPage() {
	// States
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [actionLoading, setActionLoading] = useState(false);

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
	const fetchUsers = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const data = await userApi.getUsers();

			// Normalize data to handle different field names
			const normalizedUsers = data.map((user) => ({
				id: user._id || user.id,
				name: user.name,
				email: user.email,
				role: user.role as UserRole,
				location: user.location || 'Not specified',
				status: (user.status as UserStatus) || 'active', // Default status if not provided
				lastActive: user.lastActive || null,
				joinDate: user.joinDate || user.createdAt,
				profileImage: user.profileImage || user.profilePic || '',
			}));

			setUsers(normalizedUsers);
			setIsLoading(false);
		} catch (err) {
			console.error('Failed to load users:', err);
			setError('Failed to load users data. Please try again.');
			setIsLoading(false);

			// Optionally fall back to mock data
			setUsers(getMockUsers());
		}
	};

	useEffect(() => {
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
			const aField =
				sortField === 'joinDate' && !a[sortField]
					? a.createdAt
					: a[sortField];
			const bField =
				sortField === 'joinDate' && !b[sortField]
					? b.createdAt
					: b[sortField];

			// Handle null values
			if (aField === null && bField !== null) return 1;
			if (aField !== null && bField === null) return -1;
			if (aField === null && bField === null) return 0;

			// Sort based on field type
			if (
				sortField === 'joinDate' ||
				sortField === 'lastActive' ||
				sortField === 'createdAt'
			) {
				const dateA = aField ? new Date(aField as string).getTime() : 0;
				const dateB = bField ? new Date(bField as string).getTime() : 0;
				return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
			}

			// String comparison
			const strA = String(aField).toLowerCase();
			const strB = String(bField).toLowerCase();
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
	const formatDate = (dateString: string | null | undefined) => {
		if (!dateString) return 'Never';
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		}).format(date);
	};

	// Format time ago
	const getTimeAgo = (dateString: string | null | undefined) => {
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

		setActionLoading(true);

		try {
			switch (actionType) {
				case 'promote':
					// Process users one by one
					for (const userId of selectedUsers) {
						await userApi.updateUserRole(userId, 'admin');
					}
					// Update local state to reflect changes
					setUsers((prev) =>
						prev.map((user) =>
							selectedUsers.includes(user.id)
								? { ...user, role: 'admin' }
								: user
						)
					);
					break;

				// Other cases...
			}

			// Reset selection
			setSelectedUsers([]);
		} catch (error) {
			console.error(`Error performing ${actionType}:`, error);
			setError(`Failed to ${actionType} users. Please try again.`);
		} finally {
			setActionLoading(false);
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

	// Rest of your component remains the same...
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
						<div className='flex gap-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={resetFilters}
								className='flex items-center gap-1'
							>
								<RefreshCw size={14} />
								Reset Filters
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={fetchUsers}
								className='flex items-center gap-1'
							>
								<RefreshCw size={14} />
								Refresh Data
							</Button>
						</div>
					</div>

					{/* Rest of the filters remain the same */}
					{/* ... */}

					{/* Users Table */}
					<div className='bg-card rounded-lg shadow-sm border border-border overflow-hidden mt-6'>
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
									onClick={fetchUsers}
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
																	user.profileImage ||
																	user.profilePic ||
																	''
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
															user.role ===
																'admin'
																? 'bg-primary/20 text-primary'
																: 'bg-muted text-muted-foreground'
														)}
													>
														{user.role ===
														'admin' ? (
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
															user.status.slice(
																1
															)}
													</span>
												</td>
												<td className='px-6 py-4 text-sm'>
													<div className='flex flex-col'>
														<span>
															{formatDate(
																user.joinDate ||
																	user.createdAt
															)}
														</span>
														<span className='text-xs text-muted-foreground'>
															{getTimeAgo(
																user.joinDate ||
																	user.createdAt
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
									{selectedUsers.length === 1
										? 'user'
										: 'users'}
									?
								</p>
								<div className='flex justify-end gap-2'>
									<Button
										variant='outline'
										onClick={() =>
											setShowConfirmDialog(false)
										}
										disabled={actionLoading}
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
										disabled={actionLoading}
									>
										{actionLoading ? (
											<>
												<div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2'></div>
												Processing...
											</>
										) : (
											'Confirm'
										)}
									</Button>
								</div>
							</div>
						</div>
					)}
				</section>
			</div>
		</AdminGuard>
	);
}
