import { User, UserRole, UserStatus } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function for API requests
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
	let token = null;

	if (typeof window !== 'undefined') {
		token = localStorage.getItem('auth_token');
	}

	const headers = {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
		...options.headers,
	};

	console.log(`Fetching from: ${API_URL}${endpoint}`);

	try {
		const response = await fetch(`${API_URL}${endpoint}`, {
			...options,
			headers,
			credentials: 'include',
		});

		if (response.status === 204) {
			return null;
		}

		const data = await response.json();

		if (!response.ok) {
			console.error('API error:', data);
			throw new Error(
				data.message ||
					`Error ${response.status}: ${response.statusText}`
			);
		}

		return data;
	} catch (error) {
		console.error(`API fetch error for ${endpoint}:`, error);
		throw error;
	}
}

// Mock data function
export function getMockUsers(): User[] {
	return [
		{
			id: '1',
			name: 'John Doe',
			email: 'john@example.com',
			role: 'admin' as UserRole,
			location: 'Detroit',
			status: 'active' as UserStatus,
			lastActive: new Date().toISOString(),
			joinDate: '2023-01-15T00:00:00Z',
			profileImage: '',
		},
		// Add more mock users if needed
	];
}

// User API functions
export const userApi = {
	getUsers: async (): Promise<User[]> => {
		try {
			const data = await apiFetch('/admin/users');
			return data;
		} catch (error) {
			console.error('Failed to fetch users:', error);
			return getMockUsers();
		}
	},

	updateUserRole: async (userId: string, role: UserRole): Promise<User> => {
		try {
			const data = await apiFetch(`/admin/users/${userId}/role`, {
				method: 'PUT',
				body: JSON.stringify({ role }),
			});
			return data;
		} catch (error) {
			console.error('Failed to update role:', error);
			throw error;
		}
	},

	updateUserStatus: async (
		userId: string,
		status: UserStatus
	): Promise<User> => {
		try {
			const data = await apiFetch(`/admin/users/${userId}/status`, {
				method: 'PUT',
				body: JSON.stringify({ status }),
			});
			return data;
		} catch (error) {
			console.error('Failed to update status:', error);
			throw error;
		}
	},

	deleteUser: async (userId: string): Promise<void> => {
		await apiFetch(`/admin/users/${userId}`, {
			method: 'DELETE',
		});
	},
};
