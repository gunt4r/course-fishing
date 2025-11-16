import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await import('@/services/users/service');
    const userIsAdmin = await isAdmin(request);
    return NextResponse.json({ isAdmin: userIsAdmin }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { isAdmin: false, error: error?.message || String(error) },
      { status: 200 },
    );
  }
}
