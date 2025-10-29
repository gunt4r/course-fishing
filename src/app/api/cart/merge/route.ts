import { NextResponse, NextRequest } from "next/server";
import { api } from "@/app/api/axios";

export async function POST(req: NextRequest) {
  try {
    const merged = await api.post("/cart/merge", req.body);
    return NextResponse.json({ merged });
  } catch (error: any) {
    console.error("Merge cart error:", error.message);
    return NextResponse.json(
      { message: "Failed to merge cart" },
      { status: 500 },
    );
  }
}
