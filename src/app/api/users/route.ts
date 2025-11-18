import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAllUsers, updateUser } from '@/services/users/service';
export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json(await getAllUsers());
  } catch (error) {
    throw error;
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    return NextResponse.json(await updateUser(data, request));
  } catch (error) {
    throw error;
  }
}
