import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TypographyH2 } from '@/components/ui/typography';
import { UserRole, UserStatus, SortField, SortOrder } from '../types';

interface UserFiltersProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	roleFilter: UserRole | 'all';
	setRoleFilter: (role: UserRole | 'all') => void;
	statusFilter: UserStatus | 'all';
	setStatusFilter: (status: UserStatus | 'all') => void;
	locationFilter: string;
	setLocationFilter: (location: string) => void;
	sortField: SortField;
	setSortField: (field: SortField) => void;
	sortOrder: SortOrder;
	setSortOrder: (order: SortOrder) => void;
	locations: string[];
	resetFilters: () => void;
	refreshData: () => void;
}

export function UserFilters({
	searchQuery,
	setSearchQuery,
	roleFilter,
	setRoleFilter,
	statusFilter,
	setStatusFilter,
	locationFilter,
	setLocationFilter,
	sortField,
	setSortField,
	sortOrder,
	setSortOrder,
	locations,
	resetFilters,
	refreshData,
}: UserFiltersProps) {
	return (
		<div className='mb-4'>
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4'>
				<TypographyH2 className='mb-4 md:mb-0'>Filters</TypographyH2>
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
						onClick={refreshData}
						className='flex items-center gap-1'
					>
						<RefreshCw size={14} />
						Refresh Data
					</Button>
				</div>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4'>
				{/* Search */}
				<div>
					<label className='block text-sm font-medium mb-2'>
						Search
					</label>
					<input
						type='text'
						placeholder='Search users...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
					/>
				</div>

				{/* Role Filter */}
				<div>
					<label className='block text-sm font-medium mb-2'>
						Role
					</label>
					<select
						value={roleFilter}
						onChange={(e) =>
							setRoleFilter(e.target.value as UserRole | 'all')
						}
						className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
					>
						<option value='all'>All Roles</option>
						<option value='member'>Member</option>
						<option value='admin'>Admin</option>
					</select>
				</div>

				{/* Status Filter */}
				<div>
					<label className='block text-sm font-medium mb-2'>
						Status
					</label>
					<select
						value={statusFilter}
						onChange={(e) =>
							setStatusFilter(
								e.target.value as UserStatus | 'all'
							)
						}
						className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
					>
						<option value='all'>All Status</option>
						<option value='active'>Active</option>
						<option value='inactive'>Inactive</option>
						<option value='pending'>Pending</option>
						<option value='banned'>Banned</option>
					</select>
				</div>

				{/* Location Filter */}
				<div>
					<label className='block text-sm font-medium mb-2'>
						Location
					</label>
					<select
						value={locationFilter}
						onChange={(e) => setLocationFilter(e.target.value)}
						className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
					>
						{locations.map((location) => (
							<option
								key={location}
								value={location}
							>
								{location === 'all'
									? 'All Locations'
									: location}
							</option>
						))}
					</select>
				</div>

				{/* Sort Field */}
				<div>
					<label className='block text-sm font-medium mb-2'>
						Sort By
					</label>
					<select
						value={sortField}
						onChange={(e) =>
							setSortField(e.target.value as SortField)
						}
						className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
					>
						<option value='name'>Name</option>
						<option value='email'>Email</option>
						<option value='role'>Role</option>
						<option value='location'>Location</option>
						<option value='status'>Status</option>
						<option value='joinDate'>Join Date</option>
						<option value='lastActive'>Last Active</option>
					</select>
				</div>

				{/* Sort Order */}
				<div>
					<label className='block text-sm font-medium mb-2'>
						Order
					</label>
					<select
						value={sortOrder}
						onChange={(e) =>
							setSortOrder(e.target.value as SortOrder)
						}
						className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
					>
						<option value='asc'>Ascending</option>
						<option value='desc'>Descending</option>
					</select>
				</div>
			</div>
		</div>
	);
}
