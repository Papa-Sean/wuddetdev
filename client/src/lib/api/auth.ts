import { User, LoginCredentials, SignupData } from '@/types/auth';

// Base URL for API requests
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function for API requests with authentication
async function authFetch(endpoint: string, options: RequestInit = {}) {
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
		credentials: 'include', // Keep this to include cookies in the request
	});

	// Handle non-JSON responses (like 204 No Content)
	if (response.status === 204) {
		return null;
	}

	// Get the response data
	const data = await response.json();

	// If response is not ok, throw error with message from server
	if (!response.ok) {
		console.error('API error:', data);
		throw new Error(data.message || 'Something went wrong');
	}

	return data;
}

// Authentication API functions
export const authApi = {
	login: async (
		credentials: LoginCredentials
	): Promise<{ user: User; token: string }> => {
		try {
			const data = await authFetch('/auth/login', {
				method: 'POST',
				body: JSON.stringify(credentials),
			});
			return data;
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		}
	},

	signup: async (
		userData: SignupData
	): Promise<{ user: User; token: string }> => {
		try {
			const data = await authFetch('/auth/signup', {
				method: 'POST',
				body: JSON.stringify(userData),
			});
			return data;
		} catch (error) {
			console.error('Signup error:', error);
			throw error;
		}
	},

	logout: async (): Promise<void> => {
		try {
			await authFetch('/auth/logout', {
				method: 'POST',
			});
		} catch (error) {
			console.error('Logout error:', error);
			throw error;
		}
	},

	getCurrentUser: async (): Promise<User> => {
		try {
			const data = await authFetch('/users/me');
			return data;
		} catch (error) {
			console.error('Get current user error:', error);
			throw error;
		}
	},

	updateUser: async (userData: Partial<User>): Promise<User> => {
		try {
			const data = await authFetch('/users/me', {
				method: 'PUT',
				body: JSON.stringify(userData),
			});
			return data;
		} catch (error) {
			console.error('Update user error:', error);
			throw error;
		}
	},
};
