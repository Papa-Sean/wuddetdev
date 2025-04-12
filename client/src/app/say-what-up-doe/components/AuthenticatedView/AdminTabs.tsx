import React from 'react';

interface AdminTabsProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

export function AdminTabs({ activeTab, setActiveTab }: AdminTabsProps) {
	return (
		<div className='flex border-b mb-6'>
			<button
				className={`px-4 py-2 ${
					activeTab === 'posts'
						? 'border-b-2 border-primary font-medium'
						: 'text-muted-foreground'
				}`}
				onClick={() => setActiveTab('posts')}
			>
				Community Posts
			</button>
			<button
				className={`px-4 py-2 ${
					activeTab === 'messages'
						? 'border-b-2 border-primary font-medium'
						: 'text-muted-foreground'
				}`}
				onClick={() => setActiveTab('messages')}
			>
				Guest Messages
			</button>
		</div>
	);
}
