import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ a: 5 });
}
