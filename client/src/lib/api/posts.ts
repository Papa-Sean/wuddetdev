import {
	Post,
	Comment,
	Author,
	PostFormData,
} from '@/app/say-what-up-doe/components/types';

// Add interfaces for API response structures
interface ApiAuthor {
	_id?: string;
	id?: string;
	name: string;
	profilePic?: string;
}

interface ApiComment {
	_id?: string;
	id?: string;
	content: string;
	author: ApiAuthor;
	createdAt: string;
}

interface ApiPost {
	_id?: string;
	id?: string;
	title: string;
	content: string;
	author: ApiAuthor;
	eventDate?: string;
	location?: string;
	isPinned?: boolean;
	comments: ApiComment[];
	createdAt: string;
}

interface ApiPostsResponse {
	posts: ApiPost[];
	pagination: any;
}

// Base URL for API requests
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function for API requests
async function postFetch(endpoint: string, options: RequestInit = {}) {
	const token = localStorage.getItem('auth_token');

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

export const postsApi = {
	// Get all posts with pagination
	getPosts: async (
		page = 1,
		limit = 10
	): Promise<{ posts: Post[]; pagination: any }> => {
		try {
			const data = (await postFetch(
				`/posts?page=${page}&limit=${limit}`
			)) as ApiPostsResponse;

			// Normalize MongoDB _id to id for consistent usage in the frontend
			const normalizedPosts = data.posts.map((post: ApiPost) => ({
				...post,
				id: post.id || post._id,
				author: {
					...post.author,
					id: post.author.id || post.author._id,
				},
				comments: post.comments.map((comment: ApiComment) => ({
					...comment,
					id: comment.id || comment._id,
					author: {
						...comment.author,
						id: comment.author.id || comment.author._id,
					},
				})),
			}));

			return {
				...data,
				posts: normalizedPosts,
			};
		} catch (error) {
			console.error('Get posts error:', error);
			throw error;
		}
	},

	// Create a new post
	createPost: async (postData: PostFormData): Promise<Post> => {
		try {
			const data = await postFetch('/posts', {
				method: 'POST',
				body: JSON.stringify(postData),
			});

			// Normalize the MongoDB _id to id for the new post
			return {
				...data,
				id: data.id || data._id,
				author: {
					...data.author,
					id: data.author.id || data.author._id,
				},
			};
		} catch (error) {
			console.error('Create post error:', error);
			throw error;
		}
	},

	// Add a comment to a post
	addComment: async (postId: string, content: string): Promise<any> => {
		try {
			const data = await postFetch(`/posts/${postId}/comments`, {
				method: 'POST',
				body: JSON.stringify({ content }),
			});
			return data;
		} catch (error) {
			console.error('Add comment error:', error);
			throw error;
		}
	},

	// Toggle pin status (admin only)
	togglePin: async (
		postId: string
	): Promise<{ id: string; isPinned: boolean }> => {
		try {
			const data = await postFetch(`/posts/${postId}/pin`, {
				method: 'PUT',
			});
			return data;
		} catch (error) {
			console.error('Toggle pin error:', error);
			throw error;
		}
	},

	// Delete a post (owner or admin)
	deletePost: async (postId: string): Promise<void> => {
		try {
			await postFetch(`/posts/${postId}`, {
				method: 'DELETE',
			});
		} catch (error) {
			console.error('Delete post error:', error);
			throw error;
		}
	},

	// Delete a comment from a post
	deleteComment: async (postId: string, commentId: string): Promise<void> => {
		try {
			await postFetch(`/posts/${postId}/comments/${commentId}`, {
				method: 'DELETE',
			});
		} catch (error) {
			console.error('Delete comment error:', error);
			throw error;
		}
	},
};
