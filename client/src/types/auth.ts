export type UserRole = 'member' | 'admin';

export interface User {
	id?: string;
	_id?: string; // Handle both formats
	name: string;
	email: string;
	role: UserRole;
	profilePic?: string;
	location?: string;
	bio?: string;
	joinedAt?: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface SignupData {
	name: string;
	email: string;
	password: string;
	location: string;
}

export interface AuthContextType extends AuthState {
	login: (credentials: LoginCredentials) => Promise<void>;
	signup: (data: SignupData) => Promise<void>;
	logout: () => Promise<void>;
	updateUser: (userData: Partial<User>) => Promise<void>;
	clearError: () => void;
}
