import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { GuestMessage } from '../../types';

interface GuestMessageCardProps {
	message: GuestMessage;
	onToggleResponse: (id: string) => void;
}

export function GuestMessageCard({
	message,
	onToggleResponse,
}: GuestMessageCardProps) {
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
					onClick={() => onToggleResponse(message.id)}
					className='px-3 py-1 text-sm rounded bg-muted hover:bg-muted/80 transition-colors'
				>
					Mark as {message.isResponded ? 'Pending' : 'Responded'}
				</button>
			</div>
		</div>
	);
}
