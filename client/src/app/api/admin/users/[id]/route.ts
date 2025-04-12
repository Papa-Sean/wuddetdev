import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	return NextResponse.json({ userId: params.id });
}

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	return NextResponse.json({ success: true, userId: params.id });
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	return NextResponse.json({ success: true, userId: params.id });
}
