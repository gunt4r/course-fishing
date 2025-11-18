import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { deleteUser } from '@/services/users/service';
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deletedUser = await deleteUser(id);
    return NextResponse.json({ success: true, deletedUser }, { status: 200 });
  } catch (error) {
    throw error;
  }
}
