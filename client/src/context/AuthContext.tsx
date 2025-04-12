'use client';

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import {
	User,
	AuthContextType,
	LoginCredentials,
	SignupData,
} from '@/types/auth';
import { authApi } from '@/lib/api/auth';
import { storage } from '@/lib/storage';

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
	user: null,
	isAuthenticated: false,
	isLoading: true,
	error: null,
	login: async () => {},
	signup: async () => {},
	logout: async () => {},
	updateUser: async () => {},
	clearError: () => {},
});

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	// State for authentication
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [tokenValidated, setTokenValidated] = useState<boolean>(false);

	// Clear any authentication errors
	const clearError = () => setError(null);

	// Load user from localStorage and verify token on initial load
	useEffect(() => {
		async function loadUser() {
			setIsLoading(true);

			try {
				// Check if we have a token
				const token = storage.getToken();
				if (!token) {
					setIsLoading(false);
					setTokenValidated(true);
					return;
				}

				// Get cached user data while waiting for API
				const cachedUser = storage.getUser();
				if (cachedUser) {
					setUser(cachedUser);
					setIsAuthenticated(true);
				}

				// Verify the token by fetching current user from MongoDB
				try {
					const userData = await authApi.getCurrentUser();
					setUser(userData);
					storage.setUser(userData);
					setIsAuthenticated(true);
				} catch (error) {
					console.error('Token validation error:', error);
					// If MongoDB verification fails, clear auth data
					storage.clearAuthData();
					setUser(null);
					setIsAuthenticated(false);
				}
			} catch (error) {
				console.error('Auth initialization error:', error);
				storage.clearAuthData();
				setUser(null);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
				setTokenValidated(true);
			}
		}

		loadUser();
	}, []);

	// Login function
	const login = async (credentials: LoginCredentials) => {
		setIsLoading(true);
		setError(null);

		try {
			const { user, token } = await authApi.login(credentials);

			// Store authentication data
			storage.setToken(token);
			storage.setUser(user);

			// Update state
			setUser(user);
			setIsAuthenticated(true);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Login failed';
			setError(errorMessage);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Signup function
	const signup = async (data: SignupData) => {
		setIsLoading(true);
		setError(null);

		try {
			const { user, token } = await authApi.signup(data);

			// Store authentication data
			storage.setToken(token);
			storage.setUser(user);

			// Update state
			setUser(user);
			setIsAuthenticated(true);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Signup failed';
			setError(errorMessage);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Logout function
	const logout = async () => {
		setIsLoading(true);
		setError(null);

		try {
			await authApi.logout();
		} catch (error) {
			console.error('Logout API error:', error);
			// Continue with local logout even if API fails
		} finally {
			// Always clear local auth data
			storage.clearAuthData();
			setUser(null);
			setIsAuthenticated(false);
			setIsLoading(false);
		}
	};

	// Update user function
	const updateUser = async (userData: Partial<User>) => {
		setIsLoading(true);
		setError(null);

		try {
			const updatedUser = await authApi.updateUser(userData);

			// Update local storage and state
			storage.setUser(updatedUser);
			setUser(updatedUser);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Update failed';
			setError(errorMessage);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Context value
	const contextValue: AuthContextType = {
		user,
		isAuthenticated,
		isLoading: isLoading || !tokenValidated, // Ensure we're not "ready" until token is validated
		error,
		login,
		signup,
		logout,
		updateUser,
		clearError,
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
}

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);
