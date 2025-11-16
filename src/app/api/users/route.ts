import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const { getAllUsers } = await import('@/services/users/service');
    return NextResponse.json(await getAllUsers());
  } catch (error) {
    throw error;
  }
}

export async function PATCH(request: NextRequest) {
  const { updateUser } = await import('@/services/users/service');
  try {
    const data = await request.json();
    return NextResponse.json(await updateUser(data, request));
  } catch (error) {
    throw error;
  }
}
