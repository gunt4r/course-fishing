import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/services/users/service";
export async function GET(request: NextRequest) {
  try {
    const verify = await verifyToken(request, NextResponse);
    return NextResponse.json(verify, { status: 200 });
  } catch (error) {
    throw error;
  }
}
