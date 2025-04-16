import { User } from '../types';

interface UserStatsProps {
	users: User[];
	isLoading: boolean;
}

export function UserStats({ users, isLoading }: UserStatsProps) {
	return (
		<section className='mb-8 grid grid-cols-1 md:grid-cols-4 gap-4'>
			<div className='bg-card p-4 rounded-lg shadow-sm border border-border'>
				<p className='text-muted-foreground text-sm'>Total Users</p>
				<p className='text-3xl font-bold'>
					{isLoading ? '—' : users.length}
				</p>
			</div>
			<div className='bg-card p-4 rounded-lg shadow-sm border border-border'>
				<p className='text-muted-foreground text-sm'>Active Users</p>
				<p className='text-3xl font-bold'>
					{isLoading
						? '—'
						: users.filter((u) => u.status === 'active').length}
				</p>
			</div>
			<div className='bg-card p-4 rounded-lg shadow-sm border border-border'>
				<p className='text-muted-foreground text-sm'>Admins</p>
				<p className='text-3xl font-bold'>
					{isLoading
						? '—'
						: users.filter((u) => u.role === 'admin').length}
				</p>
			</div>
			<div className='bg-card p-4 rounded-lg shadow-sm border border-border'>
				<p className='text-muted-foreground text-sm'>
					Pending Approval
				</p>
				<p className='text-3xl font-bold'>
					{isLoading
						? '—'
						: users.filter((u) => u.status === 'pending').length}
				</p>
			</div>
		</section>
	);
}
