import { NextResponse } from 'next/server';

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	return NextResponse.json({ success: true, userId: params.id });
}
