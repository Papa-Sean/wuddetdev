import { Project } from './types';

export const dummyProjects: Project[] = [
	{
		id: '1',
		title: 'Detroit City Explorer',
		description:
			'An interactive map application showcasing Detroit neighborhoods and local points of interest.',
		techStack: ['React', 'MapboxGL', 'Node.js', 'Express'],
		prototypeUrl: 'https://example.com/detroit-explorer',
		image: '/portfolio/project1.jpg',
		creator: 'Admin',
	},
	{
		id: '2',
		title: 'Michigan Tech Connect',
		description:
			'Platform connecting tech professionals across Michigan for mentorship and collaboration opportunities.',
		techStack: ['Next.js', 'Firebase', 'Tailwind CSS'],
		prototypeUrl: 'https://example.com/mi-tech-connect',
		image: '/portfolio/project2.jpg',
		creator: 'Admin',
	},
	{
		id: '3',
		title: 'Automotive Industry Dashboard',
		description:
			'Real-time analytics dashboard for monitoring automotive manufacturing metrics in Michigan.',
		techStack: ['Vue.js', 'D3.js', 'GraphQL', 'MongoDB'],
		prototypeUrl: 'https://example.com/auto-dashboard',
		image: '/portfolio/project3.jpg',
		creator: 'Admin',
	},
	{
		id: '4',
		title: 'Local Event Finder',
		description:
			'Mobile app for discovering tech meetups and workshops happening in Southeast Michigan.',
		techStack: [
			'React Native',
			'TypeScript',
			'Firebase',
			'Google Maps API',
		],
		prototypeUrl: 'https://example.com/event-finder',
		image: '/portfolio/project4.jpg',
		creator: 'Admin',
	},
	{
		id: '5',
		title: 'Coding Bootcamp Portal',
		description:
			'Educational platform showcasing Detroit-based coding bootcamps and learning resources.',
		techStack: ['Angular', 'Bootstrap', 'Node.js', 'PostgreSQL'],
		prototypeUrl: 'https://example.com/bootcamp-portal',
		image: '/portfolio/project5.jpg',
		creator: 'Admin',
	},
	{
		id: '6',
		title: 'Weather Alert System',
		description:
			'Weather monitoring application with real-time alerts for Michigan residents.',
		techStack: ['React', 'Redux', 'Weather API', 'Socket.io'],
		prototypeUrl: 'https://example.com/mi-weather',
		image: '/portfolio/project6.jpg',
		creator: 'Admin',
	},
];
