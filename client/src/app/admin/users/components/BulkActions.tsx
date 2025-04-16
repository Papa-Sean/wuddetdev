import { Button } from '@/components/ui/button';
import { Mail, Shield, UserX } from 'lucide-react';

interface BulkActionsProps {
	selectedUsers: string[];
	onAction: (action: string) => void;
}

export function BulkActions({ selectedUsers, onAction }: BulkActionsProps) {
	const hasSelection = selectedUsers.length > 0;

	return (
		<div className='flex flex-wrap gap-2 mb-4'>
			<Button
				variant='outline'
				size='sm'
				disabled={!hasSelection}
				onClick={() => onAction('promote')}
				className='flex items-center gap-1'
			>
				<Shield size={14} />
				Promote to Admin
			</Button>
			<Button
				variant='outline'
				size='sm'
				disabled={!hasSelection}
				onClick={() => onAction('demote')}
				className='flex items-center gap-1'
			>
				<Shield size={14} />
				Demote to Member
			</Button>
			<Button
				variant='outline'
				size='sm'
				disabled={!hasSelection}
				onClick={() => onAction('activate')}
				className='flex items-center gap-1'
			>
				Activate
			</Button>
			<Button
				variant='outline'
				size='sm'
				disabled={!hasSelection}
				onClick={() => onAction('deactivate')}
				className='flex items-center gap-1'
			>
				Deactivate
			</Button>
			<Button
				variant='outline'
				size='sm'
				disabled={!hasSelection}
				onClick={() => onAction('email')}
				className='flex items-center gap-1'
			>
				<Mail size={14} />
				Email
			</Button>
			<Button
				variant='outline'
				size='sm'
				disabled={!hasSelection}
				onClick={() => onAction('delete')}
				className='flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50'
			>
				<UserX size={14} />
				Delete
			</Button>
		</div>
	);
}
