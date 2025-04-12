import { Post, GuestMessage } from './types';

export const dummyPosts: Post[] = [
	{
		id: '1',
		title: 'Detroit JS Meetup - React Workshop',
		content:
			"Join us for a hands-on React workshop where we'll build a simple application from scratch. Beginners welcome!",
		eventDate: '2023-11-15T18:00:00',
		location: 'TechHub Detroit, 1570 Woodward Ave',
		author: {
			id: 'user1',
			name: 'Sarah Johnson',
			image: '/avatars/sarah.jpg',
		},
		isPinned: true,
		createdAt: '2023-10-20T14:30:00',
		comments: [
			{
				id: 'c1',
				content:
					'Looking forward to this! Will we need to bring our own laptops?',
				author: {
					id: 'user2',
					name: 'Michael Chen',
					image: '/avatars/michael.jpg',
				},
				createdAt: '2023-10-20T15:45:00',
			},
			{
				id: 'c2',
				content:
					"Yes, please bring your laptop with Node.js installed. We'll share more setup instructions closer to the date.",
				author: {
					id: 'user1',
					name: 'Sarah Johnson',
					image: '/avatars/sarah.jpg',
				},
				createdAt: '2023-10-20T16:30:00',
			},
		],
	},
	// Include remaining dummy posts...
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
