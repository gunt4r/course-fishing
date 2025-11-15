import { NextResponse } from "next/server";
import { registration } from "@/services/users/service";
export async function POST(request: Request) {
  try {
    console.log(request);
    const data = await request.json();

    const user = await registration(data);

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
