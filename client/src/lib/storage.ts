import { User } from '@/types/auth';

const TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Storage utility functions
export const storage = {
	// Token management
	getToken: (): string | null => {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(TOKEN_KEY);
	},

	setToken: (token: string): void => {
		if (typeof window === 'undefined') return;
		localStorage.setItem(TOKEN_KEY, token);
	},

	removeToken: (): void => {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(TOKEN_KEY);
	},

	// User data management
	getUser: (): User | null => {
		if (typeof window === 'undefined') return null;
		const userData = localStorage.getItem(USER_DATA_KEY);
		if (!userData) return null;

		try {
			return JSON.parse(userData);
		} catch (error) {
			console.error('Error parsing user data from localStorage', error);
			return null;
		}
	},

	setUser: (user: User): void => {
		if (typeof window === 'undefined') return;
		localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
	},

	removeUser: (): void => {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(USER_DATA_KEY);
	},

	// Clear all auth data
	clearAuthData: (): void => {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_DATA_KEY);
	},
};
