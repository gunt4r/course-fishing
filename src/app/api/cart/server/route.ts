import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getOrCreateCartServer } from '@/services/cart/service';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || '';
    const token = searchParams.get('token') || '';

    const cart = await getOrCreateCartServer(sessionId, token);
    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}
