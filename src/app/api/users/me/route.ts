import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { verifyToken } = await import('@/services/users/service');
    const verify = await verifyToken(request);
    return NextResponse.json(verify, { status: 200 });
  } catch (error) {
    throw error;
  }
}
