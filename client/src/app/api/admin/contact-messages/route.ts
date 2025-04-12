import { NextResponse } from 'next/server';

export async function GET() {
	return NextResponse.json({ messages: [] });
}

export async function POST(request: Request) {
	return NextResponse.json({ success: true });
}
