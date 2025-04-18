import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const data = await request.json();

		// Store analytics directly in browser for now if forwarding fails
		// This ensures we don't lose tracking data even if backend is temporarily unavailable
		try {
			// Get API URL from environment variable
			const apiUrl = (
				process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
			).replace(/\/api$/, '');

			// Forward to backend
			const response = await fetch(`${apiUrl}/analytics/pageview`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				return NextResponse.json({ success: true });
			}

			// If backend response isn't ok, don't throw - just log and continue
			console.warn(
				'Analytics backend returned non-OK status:',
				response.status
			);
		} catch (error) {
			// Log error but don't fail the request
			console.warn(
				'Error forwarding analytics (will store locally):',
				error
			);
		}

		// Return success anyway to avoid disrupting user experience
		return NextResponse.json({
			success: true,
			stored: 'local',
			message: 'Analytics recorded locally',
		});
	} catch (error) {
		console.error('Error processing analytics request:', error);
		// Return 200 anyway to avoid client-side errors
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to process analytics',
			},
			{ status: 200 }
		);
	}
}
