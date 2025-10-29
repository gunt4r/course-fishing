import { NextResponse } from "next/server";
import { logout } from "@/services/users/service";
export async function POST(response: NextResponse) {
  try {
    const loggedOut = await logout(response);
    return NextResponse.json(loggedOut, { status: 200 });
  } catch (error) {
    throw error;
  }
}
