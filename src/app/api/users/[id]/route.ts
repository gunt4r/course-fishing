import { deleteUser } from "@/services/users/service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const deletedUser = await deleteUser(id);
    return NextResponse.json({ success: true, deletedUser }, { status: 200 });
  } catch (error) {
    throw error;
  }
}
