import {
	GuestFormData,
	GuestMessage,
} from '@/app/say-what-up-doe/components/types';

// Base URL for API requests
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function for API requests
async function contactFetch(endpoint: string, options: RequestInit = {}) {
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

export const contactApi = {
	// Send a guest message (no auth required)
	sendGuestMessage: async (
		messageData: GuestFormData
	): Promise<{ id: string; message: string }> => {
		try {
			const data = await contactFetch('/contact', {
				method: 'POST',
				body: JSON.stringify(messageData),
			});
			return data;
		} catch (error) {
			console.error('Send message error:', error);
			throw error;
		}
	},

	// Get all guest messages (admin only)
	getGuestMessages: async (): Promise<GuestMessage[]> => {
		try {
			const data = await contactFetch('/admin/contact-messages');
			return data;
		} catch (error) {
			console.error('Get messages error:', error);
			throw error;
		}
	},

	// Update message response status (admin only)
	toggleResponseStatus: async (messageId: string): Promise<GuestMessage> => {
		try {
			const data = await contactFetch(
				`/admin/contact-messages/${messageId}/status`,
				{
					method: 'PUT',
				}
			);
			return data;
		} catch (error) {
			console.error('Toggle response status error:', error);
			throw error;
		}
	},
};
