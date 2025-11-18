import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createOrderServer } from '@/services/order/service';
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const order = await createOrderServer(data);
    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}
