import { NextResponse } from "next/server";
export async function POST() {
  try {
    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.cookies.set({
      name: process.env.NAME_JWT_TOKEN ?? "token",
      value: "",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });
    return res;
  } catch (error) {
    throw error;
  }
}
