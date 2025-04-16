import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	AlertTriangle,
	CheckCircle,
	ChevronDown,
	ChevronRight,
	Filter,
	MoreHorizontal,
	Shield,
	ShieldAlert,
	UserX,
	XCircle,
	Mail,
} from 'lucide-react';
import { User } from '../types';
import { formatDate, getTimeAgo } from '../utils/dateUtils';

interface UserTableProps {
	users: User[];
	isLoading: boolean;
	error: string | null;
	selectedUsers: string[];
	toggleSelectUser: (userId: string) => void;
	toggleSelectAll: () => void;
	resetFilters: () => void;
	fetchUsers: () => void;
	onUpdateRole: (userId: string, role: 'admin' | 'member') => Promise<void>;
	onUpdateStatus: (
		userId: string,
		status: 'active' | 'inactive'
	) => Promise<void>;
	onDeleteUser: (userId: string) => Promise<void>;
}

export function UserTable({
	users,
	isLoading,
	error,
	selectedUsers,
	toggleSelectUser,
	toggleSelectAll,
	resetFilters,
	fetchUsers,
	onUpdateRole,
	onUpdateStatus,
	onDeleteUser,
}: UserTableProps) {
	// Existing state and functions
	const [expandedRows, setExpandedRows] = useState<string[]>([]);
	const [actionLoading, setActionLoading] = useState<string | null>(null);

	// Toggle row expansion
	const toggleRowExpansion = (userId: string) => {
		setExpandedRows((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId]
		);
	};

	// Check if row is expanded
	const isRowExpanded = (userId: string) => expandedRows.includes(userId);

	// Action handlers
	const handleToggleRole = async (
		userId: string,
		currentRole: 'admin' | 'member'
	) => {
		try {
			setActionLoading(`role-${userId}`);
			const newRole = currentRole === 'admin' ? 'member' : 'admin';
			await onUpdateRole(userId, newRole);
		} catch (error) {
			console.error('Error updating user role:', error);
			alert(`Failed to update role. Please try again.`);
		} finally {
			setActionLoading(null);
		}
	};

	const handleToggleStatus = async (
		userId: string,
		currentStatus: 'active' | 'inactive' | 'pending' | 'banned'
	) => {
		try {
			setActionLoading(`status-${userId}`);

			// Only toggle between active and inactive
			const newStatus =
				currentStatus === 'active' ? 'inactive' : 'active';

			// Log the request for debugging
			console.log(`Updating user ${userId} status to ${newStatus}`);

			await onUpdateStatus(userId, newStatus);
		} catch (error) {
			console.error('Error updating user status:', error);
			alert(`Failed to update status. Please try again.`);
		} finally {
			setActionLoading(null);
		}
	};

	const handleDeleteUser = async (userId: string, userName: string) => {
		try {
			if (
				!confirm(
					`Are you sure you want to delete user ${userName}? This cannot be undone.`
				)
			) {
				return;
			}

			setActionLoading(`delete-${userId}`);
			await onDeleteUser(userId);
		} catch (error) {
			console.error('Error deleting user:', error);
			alert(`Failed to delete user. Please try again.`);
		} finally {
			setActionLoading(null);
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className='bg-card rounded-lg shadow-sm border border-border overflow-hidden'>
				<div className='flex justify-center items-center h-64'>
					<div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full'></div>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className='bg-card rounded-lg shadow-sm border border-border overflow-hidden'>
				<div className='p-8 text-center'>
					<AlertTriangle className='w-12 h-12 mx-auto mb-4 text-red-500' />
					<p className='text-lg font-medium text-red-500'>{error}</p>
					<Button
						onClick={fetchUsers}
						variant='outline'
						className='mt-4'
					>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	// Empty state
	if (users.length === 0) {
		return (
			<div className='bg-card rounded-lg shadow-sm border border-border overflow-hidden'>
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
			</div>
		);
	}

	// Mobile-first layout
	return (
		<div className='bg-card rounded-lg shadow-sm border border-border overflow-hidden'>
			{/* Desktop Table View (hidden on mobile) */}
			<div className='hidden md:block'>
				<div className='overflow-x-auto'>
					<table className='w-full'>
						<thead className='bg-muted/50 text-left'>
							<tr>
								<th className='px-4 py-3'>
									<input
										type='checkbox'
										checked={
											selectedUsers.length ===
												users.length && users.length > 0
										}
										onChange={toggleSelectAll}
										className='w-4 h-4 rounded border-gray-300'
									/>
								</th>
								<th className='px-4 py-3 font-medium'>User</th>
								<th className='px-4 py-3 font-medium'>Email</th>
								<th className='px-4 py-3 font-medium'>
									Last Active
								</th>
								<th className='px-4 py-3 font-medium w-10'></th>
							</tr>
						</thead>
						<tbody className='divide-y divide-border'>
							{users.map((user) => (
								<React.Fragment key={user.id}>
									<tr
										onClick={() =>
											toggleRowExpansion(user.id)
										}
										className='hover:bg-muted/30 transition-colors cursor-pointer'
									>
										<td
											className='px-4 py-3'
											onClick={(e) => e.stopPropagation()}
										>
											<input
												type='checkbox'
												checked={selectedUsers.includes(
													user.id
												)}
												onChange={() =>
													toggleSelectUser(user.id)
												}
												className='w-4 h-4 rounded border-gray-300'
											/>
										</td>
										<td className='px-4 py-3'>
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
										<td className='px-4 py-3 text-sm text-muted-foreground'>
											{user.email}
										</td>
										<td className='px-4 py-3 text-sm'>
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
										<td className='px-4 py-3 text-right'>
											{isRowExpanded(user.id) ? (
												<ChevronDown
													size={18}
													className='text-muted-foreground'
												/>
											) : (
												<ChevronRight
													size={18}
													className='text-muted-foreground'
												/>
											)}
										</td>
									</tr>

									{/* Expanded Row (Desktop) */}
									{isRowExpanded(user.id) && (
										<tr className='bg-muted/10'>
											<td
												colSpan={5}
												className='px-4 py-4'
											>
												<div className='grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300'>
													{/* Basic Info Section */}
													<div className='space-y-2'>
														<h4 className='font-medium mb-2 text-sm text-muted-foreground'>
															Basic Info
														</h4>
														{/* Role */}
														<div className='flex justify-between'>
															<span className='font-medium'>
																Role:
															</span>
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
																		size={
																			12
																		}
																		className='mr-1'
																	/>
																) : (
																	<Shield
																		size={
																			12
																		}
																		className='mr-1'
																	/>
																)}
																{user.role
																	.charAt(0)
																	.toUpperCase() +
																	user.role.slice(
																		1
																	)}
															</span>
														</div>
														{/* Status */}
														<div className='flex justify-between'>
															<span className='font-medium'>
																Status:
															</span>
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
																		size={
																			12
																		}
																		className='mr-1'
																	/>
																)}
																{user.status ===
																	'inactive' && (
																	<XCircle
																		size={
																			12
																		}
																		className='mr-1'
																	/>
																)}
																{user.status ===
																	'pending' && (
																	<AlertTriangle
																		size={
																			12
																		}
																		className='mr-1'
																	/>
																)}
																{user.status ===
																	'banned' && (
																	<UserX
																		size={
																			12
																		}
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
														</div>
														{/* Location */}
														<div className='flex justify-between'>
															<span className='font-medium'>
																Location:
															</span>
															<span>
																{user.location}
															</span>
														</div>
													</div>

													{/* Account Info Section */}
													<div className='space-y-2'>
														<h4 className='font-medium mb-2 text-sm text-muted-foreground'>
															Account Info
														</h4>
														<div className='flex justify-between'>
															<span className='font-medium'>
																User ID:
															</span>
															<span className='text-xs font-mono bg-muted px-2 py-1 rounded'>
																{user.id.substring(
																	0,
																	8
																)}
																...
															</span>
														</div>
														<div className='flex justify-between'>
															<span className='font-medium'>
																Joined:
															</span>
															<span>
																{formatDate(
																	user.joinDate ||
																		user.createdAt
																)}
															</span>
														</div>
														<div className='flex justify-between'>
															<span className='font-medium'>
																Last Active:
															</span>
															<span>
																{formatDate(
																	user.lastActive
																)}
															</span>
														</div>
													</div>

													{/* Actions Section */}
													<div className='flex flex-col gap-2'>
														<h4 className='font-medium mb-2 text-sm text-muted-foreground'>
															Actions
														</h4>
														<Button
															size='sm'
															variant='outline'
															className='justify-start'
															onClick={() =>
																handleToggleRole(
																	user.id,
																	user.role as
																		| 'admin'
																		| 'member'
																)
															}
															disabled={
																actionLoading ===
																`role-${user.id}`
															}
														>
															{actionLoading ===
															`role-${user.id}` ? (
																<>
																	<div className='animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2'></div>
																	Processing...
																</>
															) : (
																<>
																	<Shield
																		size={
																			14
																		}
																		className='mr-2'
																	/>
																	{user.role ===
																	'admin'
																		? 'Remove Admin'
																		: 'Make Admin'}
																</>
															)}
														</Button>
														<Button
															size='sm'
															variant='outline'
															className='justify-start'
															onClick={() =>
																handleToggleStatus(
																	user.id,
																	user.status as
																		| 'active'
																		| 'inactive'
																		| 'pending'
																		| 'banned'
																)
															}
															disabled={
																actionLoading ===
																`status-${user.id}`
															}
														>
															{actionLoading ===
															`status-${user.id}` ? (
																<>
																	<div className='animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2'></div>
																	Processing...
																</>
															) : (
																<>
																	{user.status ===
																	'active' ? (
																		<XCircle
																			size={
																				14
																			}
																			className='mr-2'
																		/>
																	) : (
																		<CheckCircle
																			size={
																				14
																			}
																			className='mr-2'
																		/>
																	)}
																	{user.status ===
																	'active'
																		? 'Deactivate Account'
																		: 'Activate Account'}
																</>
															)}
														</Button>
														<Button
															size='sm'
															variant='outline'
															className='justify-start text-red-600 border-red-200 hover:bg-red-50'
															onClick={() =>
																handleDeleteUser(
																	user.id,
																	user.name
																)
															}
															disabled={
																actionLoading ===
																`delete-${user.id}`
															}
														>
															{actionLoading ===
															`delete-${user.id}` ? (
																<>
																	<div className='animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full mr-2'></div>
																	Deleting...
																</>
															) : (
																<>
																	<UserX
																		size={
																			14
																		}
																		className='mr-2'
																	/>
																	Delete User
																</>
															)}
														</Button>
													</div>
												</div>
											</td>
										</tr>
									)}
								</React.Fragment>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Mobile Card View (hidden on desktop) */}
			<div className='md:hidden'>
				<div className='p-2'>
					{/* Mobile Select All */}
					<div className='flex items-center justify-between py-2 px-3 bg-muted/30 rounded-md mb-3'>
						<div className='flex items-center space-x-2'>
							<input
								type='checkbox'
								checked={
									selectedUsers.length === users.length &&
									users.length > 0
								}
								onChange={toggleSelectAll}
								className='w-4 h-4 rounded border-gray-300'
							/>
							<span className='text-sm font-medium'>
								Select all
							</span>
						</div>
						<span className='text-xs text-muted-foreground'>
							{users.length} users
						</span>
					</div>

					{/* User Cards */}
					<div className='space-y-3'>
						{users.map((user) => (
							<div
								key={user.id}
								className='border border-border rounded-md overflow-hidden bg-card'
							>
								{/* Card Header with Basic Info */}
								<div
									className='p-3 flex items-center justify-between cursor-pointer'
									onClick={() => toggleRowExpansion(user.id)}
								>
									<div className='flex items-center space-x-3'>
										<input
											type='checkbox'
											checked={selectedUsers.includes(
												user.id
											)}
											onChange={(e) => {
												e.stopPropagation();
												toggleSelectUser(user.id);
											}}
											className='w-4 h-4 rounded border-gray-300'
										/>
										<Avatar className='h-8 w-8'>
											<AvatarImage
												src={
													user.profileImage ||
													user.profilePic ||
													''
												}
											/>
											<AvatarFallback>
												{user.name.substring(0, 2)}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className='font-medium text-sm'>
												{user.name}
											</div>
											<div className='text-xs text-muted-foreground'>
												{user.email}
											</div>
										</div>
									</div>
									<div className='flex items-center'>
										<span
											className={cn(
												'mr-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium',
												user.status === 'active' &&
													'bg-green-50 text-green-700',
												user.status === 'inactive' &&
													'bg-gray-100 text-gray-700',
												user.status === 'pending' &&
													'bg-amber-50 text-amber-700',
												user.status === 'banned' &&
													'bg-red-50 text-red-700'
											)}
										>
											{user.status
												.charAt(0)
												.toUpperCase() +
												user.status.slice(1)}
										</span>
										{isRowExpanded(user.id) ? (
											<ChevronDown
												size={18}
												className='text-muted-foreground'
											/>
										) : (
											<ChevronRight
												size={18}
												className='text-muted-foreground'
											/>
										)}
									</div>
								</div>

								{/* Expanded Content (Mobile) */}
								{isRowExpanded(user.id) && (
									<div className='border-t border-border p-3 animate-in fade-in duration-200'>
										<div className='space-y-4'>
											{/* User Information */}
											<div className='bg-muted/20 rounded-md p-3 space-y-2 text-sm'>
												<div className='flex justify-between'>
													<span className='font-medium'>
														Role:
													</span>
													<span
														className={cn(
															'inline-flex items-center',
															user.role ===
																'admin' &&
																'text-primary'
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
												</div>
												<div className='flex justify-between'>
													<span className='font-medium'>
														Location:
													</span>
													<span>{user.location}</span>
												</div>
												<div className='flex justify-between'>
													<span className='font-medium'>
														Joined:
													</span>
													<span>
														{formatDate(
															user.joinDate ||
																user.createdAt
														)}
													</span>
												</div>
												<div className='flex justify-between'>
													<span className='font-medium'>
														Last Active:
													</span>
													<span>
														{getTimeAgo(
															user.lastActive
														)}
													</span>
												</div>
											</div>

											{/* Quick Actions */}
											<div className='grid grid-cols-2 gap-2'>
												<Button
													size='sm'
													variant='outline'
													className='text-xs justify-center'
													onClick={() =>
														handleToggleRole(
															user.id,
															user.role as
																| 'admin'
																| 'member'
														)
													}
													disabled={
														actionLoading ===
														`role-${user.id}`
													}
												>
													{actionLoading ===
													`role-${user.id}` ? (
														<div className='animate-spin w-3 h-3 border border-primary border-t-transparent rounded-full'></div>
													) : user.role ===
													  'admin' ? (
														<>
															<Shield
																size={12}
																className='mr-1'
															/>{' '}
															Remove Admin
														</>
													) : (
														<>
															<ShieldAlert
																size={12}
																className='mr-1'
															/>{' '}
															Make Admin
														</>
													)}
												</Button>
												<Button
													size='sm'
													variant='outline'
													className='text-xs justify-center'
												>
													<Mail
														size={12}
														className='mr-1'
													/>{' '}
													Email User
												</Button>
												<Button
													size='sm'
													variant='outline'
													className='text-xs justify-center'
													onClick={() =>
														handleToggleStatus(
															user.id,
															user.status as
																| 'active'
																| 'inactive'
																| 'pending'
																| 'banned'
														)
													}
													disabled={
														actionLoading ===
														`status-${user.id}`
													}
												>
													{actionLoading ===
													`status-${user.id}` ? (
														<div className='animate-spin w-3 h-3 border border-primary border-t-transparent rounded-full'></div>
													) : user.status ===
													  'active' ? (
														<>
															<XCircle
																size={12}
																className='mr-1'
															/>{' '}
															Deactivate
														</>
													) : (
														<>
															<CheckCircle
																size={12}
																className='mr-1'
															/>{' '}
															Activate
														</>
													)}
												</Button>
												<Button
													size='sm'
													variant='outline'
													className='text-xs justify-center text-red-600 border-red-200'
													onClick={() =>
														handleDeleteUser(
															user.id,
															user.name
														)
													}
													disabled={
														actionLoading ===
														`delete-${user.id}`
													}
												>
													{actionLoading ===
													`delete-${user.id}` ? (
														<div className='animate-spin w-3 h-3 border border-red-600 border-t-transparent rounded-full'></div>
													) : (
														<>
															<UserX
																size={12}
																className='mr-1'
															/>{' '}
															Delete
														</>
													)}
												</Button>
											</div>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Pagination (works for both views) */}
			<div className='px-4 py-4 border-t border-border flex justify-between items-center'>
				<span className='text-xs sm:text-sm text-muted-foreground'>
					Showing {users.length} users
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
	);
}
