import { NextResponse, NextRequest } from "next/server";
import { updateUserServer } from "@/services/users/service";

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    return NextResponse.json(await updateUserServer(data));
  } catch (error) {
    throw error;
  }
}
