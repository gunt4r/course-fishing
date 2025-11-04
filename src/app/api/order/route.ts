import { NextResponse, NextRequest } from "next/server";
import { createOrder } from "@/services/order/service";

export async function GET(request: NextRequest) {
  const responseInternal = NextResponse.next();
  try {
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}

export async function POST( request: NextRequest, response: NextResponse) {
  try {
    const data = await request.json();
    const order = await createOrder(data, request, response);
    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}
