import { NextResponse } from 'next/server';

// Fix the type definition to match what Next.js 15 expects
export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
): Promise<Response> {
	try {
		// Get the role from request body
		const body = await request.json();
		const { role } = body;
		const { id } = params;

		// Here you would implement the actual role update logic
		// For example: await updateUserRole(id, role);

		// Return successful response
		return NextResponse.json({
			success: true,
			userId: id,
			role,
		});
	} catch (error) {
		// Error handling
		console.error('Error updating user role:', error);
		return NextResponse.json(
			{ error: 'Failed to update user role' },
			{ status: 500 }
		);
	}
}
