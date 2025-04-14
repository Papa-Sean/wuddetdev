import { Post, GuestMessage } from './types';

export const dummyPosts: Post[] = [
	{
		id: '1',
		title: 'Detroit JS Meetup - React Workshop',
		content: 'Join us for a hands-on React workshop...',
		eventDate: '2023-11-15T18:00:00',
		location: 'TechHub Detroit, 1570 Woodward Ave',
		author: {
			id: 'user1',
			name: 'Sarah Johnson',
			image: '/avatars/sarah.jpg', // This is fine now that we're using the Author interface
		},
		isPinned: true,
		createdAt: '2023-10-20T14:30:00',
		comments: [
			// Your comments here
		],
	},
	// Other posts
];

export const dummyGuestMessages: GuestMessage[] = [
	{
		id: 'g1',
		name: 'David Lee',
		email: 'david.lee@example.com',
		message:
			"I'm a frontend developer new to Detroit. How can I join your community?",
		createdAt: '2023-10-19T08:45:00',
		isResponded: false,
	},
	// Include remaining guest messages...
];
