import { getProductById } from "@/services/product/service";
import { NextRequest, NextResponse } from "next/server";
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}
