import { NextRequest, NextResponse } from "next/server";
import { updateOrder, deleteOrder } from "@/services/order/service";
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const updatedOrder = await updateOrder(id, await request.json());
    return NextResponse.json({ success: true, updatedOrder }, { status: 200 });
  } catch (error) {
    throw error;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const deletedOrder = await deleteOrder(id);
    return NextResponse.json({ success: true, deletedOrder }, { status: 200 });
  } catch (error) {
    throw error;
  }
}
