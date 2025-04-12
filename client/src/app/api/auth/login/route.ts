// client/src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		// Validate request body
		if (!body.email || !body.password) {
			return NextResponse.json(
				{
					error: 'ValidationError',
					message: 'Email and password are required',
				},
				{ status: 400 }
			);
		}

		// Call the authentication service
		const response = await fetch(`${process.env.API_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(data, { status: response.status });
		}

		// Return the user data and token
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{ error: 'ServerError', message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
