import React from 'react';
import { GuestMessage } from '../../types';
import { GuestMessageCard } from './GuestMessageCard';

interface GuestMessagesListProps {
	messages: GuestMessage[];
	toggleResponseStatus: (id: string) => void;
	deleteMessage: (id: string) => void; // Add delete function prop
}

export function GuestMessagesList({
	messages,
	toggleResponseStatus,
	deleteMessage,
}: GuestMessagesListProps) {
	// Filter out duplicate messages based on ID or content
	const uniqueMessages = messages.reduce((acc: GuestMessage[], current) => {
		// Use both ID fields for comparison
		const key = current.id || current._id;
		const isDuplicate = acc.some((item) => (item.id || item._id) === key);

		if (!isDuplicate) {
			return [...acc, current];
		}
		return acc;
	}, []);

	return (
		<div className='bg-card rounded-lg p-6 shadow-lg'>
			<h2 className='text-xl font-bold mb-6'>Guest Messages</h2>

			{uniqueMessages.length === 0 ? (
				<p className='text-center text-muted-foreground py-8'>
					No guest messages to display.
				</p>
			) : (
				<div className='space-y-4'>
					{uniqueMessages.map((message) => (
						<GuestMessageCard
							key={message.id || message._id}
							message={message}
							onToggleResponse={toggleResponseStatus}
							onDelete={deleteMessage} // Pass delete handler
						/>
					))}
				</div>
			)}
		</div>
	);
}
