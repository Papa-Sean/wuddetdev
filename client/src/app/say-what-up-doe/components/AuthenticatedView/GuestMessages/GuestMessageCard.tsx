import React from 'react';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react'; // Add Trash2 icon
import { GuestMessage } from '../../types';

interface GuestMessageCardProps {
	message: GuestMessage;
	onToggleResponse: (id: string) => void;
	onDelete: (id: string) => void; // Add delete handler prop
}

export function GuestMessageCard({
	message,
	onToggleResponse,
	onDelete,
}: GuestMessageCardProps) {
	// Get the message ID safely
	const messageId = message.id || message._id || '';

	// Handler for delete button
	const handleDelete = () => {
		if (window.confirm('Are you sure you want to delete this message?')) {
			onDelete(messageId);
		}
	};

	return (
		<div className='border rounded-md p-4 flex flex-col md:flex-row justify-between gap-4'>
			<div>
				<div className='flex items-center gap-2 mb-1'>
					<h3 className='font-medium'>{message.name}</h3>
					<span className='text-sm text-muted-foreground'>
						({message.email})
					</span>
				</div>
				<p className='mb-2'>{message.message}</p>
				<p className='text-sm text-muted-foreground'>
					Received: {new Date(message.createdAt).toLocaleString()}
				</p>
			</div>
			<div className='flex items-center gap-3'>
				<span
					className={`flex items-center gap-1 text-sm ${
						message.isResponded
							? 'text-green-500'
							: 'text-amber-500'
					}`}
				>
					{message.isResponded ? (
						<>
							<CheckCircle size={16} />
							Responded
						</>
					) : (
						<>
							<XCircle size={16} />
							Pending
						</>
					)}
				</span>
				<button
					onClick={() => onToggleResponse(messageId)}
					className='px-3 py-1 text-sm rounded bg-muted hover:bg-muted/80 transition-colors'
				>
					Mark as {message.isResponded ? 'Pending' : 'Responded'}
				</button>

				{/* New delete button - only show for responded messages */}
				{message.isResponded && (
					<button
						onClick={handleDelete}
						className='p-1 rounded-full hover:bg-red-100 text-red-500'
						title='Delete message'
					>
						<Trash2 size={18} />
					</button>
				)}
			</div>
		</div>
	);
}
