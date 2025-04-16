export type UserRole = 'admin' | 'member';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'banned';
export type SortField =
	| 'name'
	| 'email'
	| 'role'
	| 'location'
	| 'status'
	| 'joinDate'
	| 'lastActive'
	| 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface User {
	id: string;
	_id?: string;
	name: string;
	email: string;
	role: UserRole;
	location: string;
	status: UserStatus;
	lastLogin?: string; // Added this field to match the auth.ts User interface
	lastActive: string | null;
	joinDate?: string;
	createdAt?: string;
	profileImage?: string;
	profilePic?: string;
}
