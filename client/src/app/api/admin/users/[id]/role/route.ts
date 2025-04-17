import { NextResponse } from 'next/server';

// Fix the type definition to match Next.js 15's expectations
export async function PUT(
	request: Request,
	context: { params: { id: string } }
): Promise<Response> {
	try {
		// Get the role from request body
		const body = await request.json();
		const { role } = body;
		const { id } = context.params; // Get id from context.params

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
