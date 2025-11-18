import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/services/users/service';
export async function GET(request: NextRequest) {
  try {
    const verify = await verifyToken(request);
    return NextResponse.json(verify, { status: 200 });
  } catch (error) {
    throw error;
  }
}
