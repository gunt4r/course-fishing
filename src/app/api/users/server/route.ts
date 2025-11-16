import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  const { updateUserServer } = await import('@/services/users/service');
  try {
    const data = await request.json();
    return NextResponse.json(await updateUserServer(data));
  } catch (error) {
    throw error;
  }
}
