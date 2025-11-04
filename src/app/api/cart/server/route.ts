import { NextResponse } from "next/server";
import { getOrCreateCartServer } from "@/services/cart/service";

export async function GET(sessionId: string, token: string) {
  try {
    const cart = await getOrCreateCartServer(sessionId, token);
    const out = NextResponse.json({ success: true, cart }, { status: 200 });
    return out;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}
