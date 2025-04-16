'use client';

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/guards/AdminGuard';
import { TypographyH1 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { UserRole, UserStatus, SortField, SortOrder, User } from './types';
import { userApi } from './api/userApi';
import { UserStats } from './components/UserStats';
import { UserFilters } from './components/UserFilters';
import { UserTable } from './components/UserTable';
import { BulkActions } from './components/BulkActions';
import { BulkActionDialog } from './components/BulkActionDialog';

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
				status: (user.status as UserStatus) || 'active',
				lastActive: user.lastLogin || user.lastActive || null, // Use lastLogin if available, fall back to lastActive
				joinDate: user.joinDate || user.createdAt,
				profileImage: user.profileImage || user.profilePic || '',
			}));

			setUsers(normalizedUsers);
		} catch (err) {
			console.error('Failed to load users:', err);
			setError('Failed to load users data. Please try again.');
		} finally {
			setIsLoading(false);
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

				case 'demote':
					for (const userId of selectedUsers) {
						await userApi.updateUserRole(userId, 'member');
					}
					setUsers((prev) =>
						prev.map((user) =>
							selectedUsers.includes(user.id)
								? { ...user, role: 'member' }
								: user
						)
					);
					break;

				case 'activate':
					for (const userId of selectedUsers) {
						await userApi.updateUserStatus(userId, 'active');
					}
					setUsers((prev) =>
						prev.map((user) =>
							selectedUsers.includes(user.id)
								? { ...user, status: 'active' }
								: user
						)
					);
					break;

				case 'deactivate':
					for (const userId of selectedUsers) {
						await userApi.updateUserStatus(userId, 'inactive');
					}
					setUsers((prev) =>
						prev.map((user) =>
							selectedUsers.includes(user.id)
								? { ...user, status: 'inactive' }
								: user
						)
					);
					break;

				case 'delete':
					for (const userId of selectedUsers) {
						await userApi.deleteUser(userId);
					}
					setUsers((prev) =>
						prev.filter((user) => !selectedUsers.includes(user.id))
					);
					break;

				case 'email':
					// Email functionality would go here
					console.log('Email feature would be implemented here');
					break;
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

	// Update user role (Make Admin/Remove Admin)
	const handleUpdateRole = async (
		userId: string,
		role: 'admin' | 'member'
	): Promise<void> => {
		try {
			// Show loading feedback in the UI if needed
			setActionLoading(true);

			// Call API to update the role
			await userApi.updateUserRole(userId, role);

			// Update local state to reflect the change
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user.id === userId ? { ...user, role } : user
				)
			);
		} catch (error) {
			console.error('Error updating user role:', error);
			setError('Failed to update user role. Please try again.');
			throw error; // Re-throw so component can handle it
		} finally {
			setActionLoading(false);
		}
	};

	// Update user status (Activate/Deactivate)
	const handleUpdateStatus = async (
		userId: string,
		status: 'active' | 'inactive'
	): Promise<void> => {
		try {
			setActionLoading(true);
			console.log(`Page: Updating user ${userId} status to ${status}`);
			await userApi.updateUserStatus(userId, status);

			// Update local state with new status
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user.id === userId ? { ...user, status } : user
				)
			);
		} catch (error) {
			console.error('Error updating user status:', error);
			setError('Failed to update user status. Please try again.');
			throw error;
		} finally {
			setActionLoading(false);
		}
	};

	// Delete user handler
	const handleDeleteUser = async (userId: string): Promise<void> => {
		try {
			setActionLoading(true);
			await userApi.deleteUser(userId);

			// Remove user from the list
			setUsers((prevUsers) =>
				prevUsers.filter((user) => user.id !== userId)
			);
		} catch (error) {
			console.error('Error deleting user:', error);
			setError('Failed to delete user. Please try again.');
			throw error;
		} finally {
			setActionLoading(false);
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

	return (
		<AdminGuard>
			<div className='container mx-auto px-4 py-8'>
				{/* Header */}
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

				{/* Stats */}
				<UserStats
					users={users}
					isLoading={isLoading}
				/>

				{/* Filters Section */}
				<section className='mb-6 bg-card rounded-lg shadow-sm border border-border p-6'>
					<UserFilters
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						roleFilter={roleFilter}
						setRoleFilter={setRoleFilter}
						statusFilter={statusFilter}
						setStatusFilter={setStatusFilter}
						locationFilter={locationFilter}
						setLocationFilter={setLocationFilter}
						sortField={sortField}
						setSortField={setSortField}
						sortOrder={sortOrder}
						setSortOrder={setSortOrder}
						locations={locations}
						resetFilters={resetFilters}
						refreshData={fetchUsers}
					/>

					{/* Bulk Actions */}
					<BulkActions
						selectedUsers={selectedUsers}
						onAction={handleBulkAction}
					/>

					{/* User Table */}
					<UserTable
						users={filteredUsers}
						isLoading={isLoading}
						error={error}
						selectedUsers={selectedUsers}
						toggleSelectUser={toggleSelectUser}
						toggleSelectAll={toggleSelectAll}
						resetFilters={resetFilters}
						fetchUsers={fetchUsers}
						onUpdateRole={handleUpdateRole}
						onUpdateStatus={handleUpdateStatus}
						onDeleteUser={handleDeleteUser}
					/>

					{/* Confirmation Dialog */}
					<BulkActionDialog
						isOpen={showConfirmDialog}
						actionType={actionType}
						userCount={selectedUsers.length}
						isLoading={actionLoading}
						onConfirm={confirmBulkAction}
						onCancel={() => setShowConfirmDialog(false)}
					/>
				</section>
			</div>
		</AdminGuard>
	);
}
