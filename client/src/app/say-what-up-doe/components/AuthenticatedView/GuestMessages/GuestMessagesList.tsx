import React from 'react';
import { GuestMessage } from '../../types';
import { GuestMessageCard } from './GuestMessageCard';

interface GuestMessagesListProps {
	messages: GuestMessage[];
	toggleResponseStatus: (id: string) => void;
}

export function GuestMessagesList({
	messages,
	toggleResponseStatus,
}: GuestMessagesListProps) {
	return (
		<div className='bg-card rounded-lg p-6 shadow-lg'>
			<h2 className='text-xl font-bold mb-6'>Guest Messages</h2>

			{messages.length === 0 ? (
				<p className='text-center text-muted-foreground py-8'>
					No guest messages to display.
				</p>
			) : (
				<div className='space-y-4'>
					{messages.map((message) => (
						<GuestMessageCard
							key={message.id}
							message={message}
							onToggleResponse={toggleResponseStatus}
						/>
					))}
				</div>
			)}
		</div>
	);
}
