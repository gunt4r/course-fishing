import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { registration } = await import('@/services/users/service');
  try {
    const data = await request.json();

    const user = await registration(data);

    return NextResponse.json(user, { status: 201 });
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
