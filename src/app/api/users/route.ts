import { NextResponse } from "next/server";
import { getAllUsers, registration } from "@/services/users/service";

export async function GET(request: Request) {
  try {
    return NextResponse.json(await getAllUsers());
  } catch (error) {
    throw error;
  }
}
