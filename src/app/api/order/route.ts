import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/services/order/service';
export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json(await getAllOrders(), { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const responseInternal = NextResponse.next();
  try {
    const data = await request.json();
    const order = await createOrder(data, request, responseInternal);
    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}
