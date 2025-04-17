import { User } from '@/types/auth';

// Define types for content management
export interface ContentComment {
	id: string;
	_id?: string;
	content: string;
	author: {
		id: string;
		name: string;
		email?: string;
		profilePic?: string;
	};
	postId: string;
	postTitle?: string;
	createdAt: string;
}

export interface ContentPost {
	id: string;
	_id?: string;
	title: string;
	content: string;
	author: {
		id: string;
		name: string;
		email?: string;
		profilePic?: string;
	};
	createdAt: string;
	isPinned?: boolean;
	eventDate?: string;
	location?: string;
	comments: ContentComment[];
}

export interface ContentProject {
	id: string;
	_id?: string;
	title: string;
	description: string;
	technologies: string[];
	imageUrl?: string;
	liveUrl?: string;
	repoUrl?: string;
	author: {
		id: string;
		name: string;
	};
	createdAt: string;
	featured?: boolean;
}

export type ContentItemType = 'post' | 'project' | 'comment';
export type FilterType = 'all' | 'recent' | 'pinned' | 'featured';

interface ContentResponse {
	posts: ContentPost[];
	projects: ContentProject[];
	comments: ContentComment[];
	pagination: {
		posts: { total: number; page: number; limit: number };
		projects: { total: number; page: number; limit: number };
		comments: { total: number; page: number; limit: number };
	};
}

// Base URL for API requests
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function for API requests
async function contentFetch(endpoint: string, options: RequestInit = {}) {
	const token = localStorage.getItem('auth_token');

	const headers = {
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...(options.headers || {}),
	};

	const response = await fetch(`${API_URL}${endpoint}`, {
		...options,
		headers,
	});

	// Check if the response is successful
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'API request failed');
	}

	if (response.status === 204) {
		return null;
	}

	return response.json();
}

// Content API object with methods
export const contentApi = {
	// Get all content with filters
	getContent: async (
		type?: 'posts' | 'projects' | 'comments',
		filter: FilterType = 'all',
		search: string = '',
		page: number = 1,
		limit: number = 10
	): Promise<ContentResponse> => {
		try {
			const queryParams = new URLSearchParams({
				...(type ? { type } : {}),
				filter,
				...(search ? { search } : {}),
				page: page.toString(),
				limit: limit.toString(),
			});

			const data = await contentFetch(
				`/content?${queryParams.toString()}`
			);

			// Safe normalize function that handles null/undefined values
			const normalizeId = (item: any) => {
				if (!item) return null; // Return null if item is null or undefined
				return {
					...item,
					id: item._id || item.id || generateTempId(), // Fallback to a temporary ID if needed
				};
			};

			// Helper function to generate a temporary ID if needed
			const generateTempId = () =>
				`temp_${Math.random().toString(36).substring(2, 15)}`;

			return {
				posts: Array.isArray(data.posts)
					? data.posts.map((post: any) => ({
							...normalizeId(post),
							author: normalizeId(post?.author),
							comments: Array.isArray(post?.comments)
								? post.comments
										.filter(Boolean) // Filter out null comments
										.map((comment: any) => ({
											...normalizeId(comment),
											author: normalizeId(
												comment?.author
											),
										}))
								: [],
					  }))
					: [],
				projects: Array.isArray(data.projects)
					? data.projects
							.filter(Boolean) // Filter out null projects
							.map((project: any) => ({
								...normalizeId(project),
								author: normalizeId(project?.author),
								technologies:
									project?.technologies ||
									project?.techStack ||
									[],
							}))
					: [],
				comments: Array.isArray(data.comments)
					? data.comments
							.filter(Boolean) // Filter out null comments
							.map((comment: any) => ({
								...normalizeId(comment),
								author: normalizeId(comment?.author),
							}))
					: [],
				pagination: data.pagination || {
					posts: { total: 0, page: 1, limit },
					projects: { total: 0, page: 1, limit },
					comments: { total: 0, page: 1, limit },
				},
			};
		} catch (error) {
			console.error('Get content error:', error);
			throw error;
		}
	},

	// Toggle pin status for post
	togglePin: async (
		postId: string
	): Promise<{ id: string; isPinned: boolean }> => {
		try {
			const data = await contentFetch(`/posts/${postId}/pin`, {
				method: 'PUT',
			});
			return { id: data.id || data._id, isPinned: data.isPinned };
		} catch (error) {
			console.error('Toggle pin error:', error);
			throw error;
		}
	},

	// Toggle feature status for project
	toggleFeature: async (
		projectId: string
	): Promise<{ id: string; featured: boolean }> => {
		try {
			const data = await contentFetch(
				`/content/projects/${projectId}/feature`,
				{
					method: 'PUT',
				}
			);
			return { id: data.id || data._id, featured: data.featured };
		} catch (error) {
			console.error('Toggle feature error:', error);
			throw error;
		}
	},

	// Bulk operations on content items
	bulkAction: async (
		action: 'delete' | 'pin' | 'unpin' | 'feature' | 'unfeature',
		itemType: ContentItemType,
		items: string[]
	): Promise<{ success: boolean; count: number; items: string[] }> => {
		try {
			const data = await contentFetch(`/content/bulk/${action}`, {
				method: 'POST',
				body: JSON.stringify({ items, itemType }),
			});
			return data;
		} catch (error) {
			console.error(`Bulk ${action} error:`, error);
			throw error;
		}
	},

	// Get content counts
	getContentCounts: async () => {
		try {
			return await contentFetch('/content/counts');
		} catch (error) {
			console.error('Error fetching content counts:', error);
			throw error;
		}
	},
};
