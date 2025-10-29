import { NextResponse } from "next/server";
import { authentication } from "@/services/users/service";
import { NextResponse, NextRequest } from "next/server";
export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const data = await request.json();

    const user = await authentication(data, request, response);

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to create user",
        details: error.detail || error.toString(),
      },
      { status: 500 },
    );
  }
}
