import { Project } from '@/app/portfolio/components/types';

// Base URL for API requests
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function for API requests with authentication
async function projectFetch(endpoint: string, options: RequestInit = {}) {
	let token = null;

	// Only access localStorage in browser environment
	if (typeof window !== 'undefined') {
		token = localStorage.getItem('auth_token');
	}

	const headers = {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
		...options.headers,
	};

	const response = await fetch(`${API_URL}${endpoint}`, {
		...options,
		headers,
		credentials: 'include',
	});

	// Handle non-JSON responses
	if (response.status === 204) {
		return null;
	}

	const data = await response.json();

	if (!response.ok) {
		console.error('API error:', data);
		throw new Error(data.message || 'Something went wrong');
	}

	return data;
}

// Project data interface for creation/updates
export interface ProjectData {
	title: string;
	description: string;
	techStack: string[];
	prototypeUrl?: string;
	image?: string;
}

export const projectsApi = {
	// Get all projects
	getProjects: async (): Promise<Project[]> => {
		try {
			const data = await projectFetch('/projects');

			// Normalize the MongoDB data to match our expected format
			return data.map((project: any) => ({
				id: project._id || project.id,
				_id: project._id || project.id, // Include both formats for safety
				title: project.title || 'Untitled Project',
				description: project.description || 'No description available',
				techStack: project.techStack || [],
				prototypeUrl: project.prototypeUrl || '#',
				image:
					project.image ||
					`/portfolio/project${
						Math.floor(Math.random() * 6) + 1
					}.jpg`,
				creator: 'Admin', // Default value instead of accessing nested property
				// Use optional chaining to safely access nested properties
				author: {
					name:
						project.author?.name ||
						project.creator?.name ||
						'Unknown',
					id: (
						project.author?._id ||
						project.creator?._id ||
						'unknown-id'
					).toString(),
				},
			}));
		} catch (error) {
			console.error('Get projects error:', error);
			throw error;
		}
	},

	// Create a new project (admin only)
	createProject: async (projectData: ProjectData): Promise<Project> => {
		try {
			// Ensure we have all required fields with defaults if needed
			const dataWithDefaults = {
				...projectData,
				prototypeUrl: projectData.prototypeUrl || '#',
				image:
					projectData.image ||
					`/portfolio/project${
						Math.floor(Math.random() * 6) + 1
					}.jpg`,
			};

			const data = await projectFetch('/projects', {
				method: 'POST',
				body: JSON.stringify(dataWithDefaults),
			});

			// Normalize the response
			return {
				id: data._id || data.id,
				_id: data._id || data.id, // Include both formats
				title: data.title,
				description: data.description,
				techStack: data.techStack || [],
				prototypeUrl: data.prototypeUrl || '#',
				image:
					data.image ||
					`/portfolio/project${
						Math.floor(Math.random() * 6) + 1
					}.jpg`,
				creator: data.creator?.name || 'Admin',
			};
		} catch (error) {
			console.error('Create project error:', error);
			throw error;
		}
	},

	// Delete a project (admin only)
	deleteProject: async (id: string): Promise<void> => {
		try {
			await projectFetch(`/projects/${id}`, {
				method: 'DELETE',
			});
		} catch (error) {
			console.error('Delete project error:', error);
			throw error;
		}
	},
};
