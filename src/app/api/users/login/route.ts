import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authentication } from '@/services/users/service';
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { token, user } = await authentication(data);

    const res = NextResponse.json(user, { status: 201 });

    res.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || 'Failed to create user',
        details: error.detail || error.toString(),
      },
      { status: 500 },
    );
  }
}
