import Logger from "@/src/utils/loggerServer";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { Book } from "../../../models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let query: string | null = "";
  try {
    const url = req.nextUrl;
    query = url.searchParams.get("query") ?? "";
    if (!query) {
      return NextResponse.json(
        { error: "Missing query parameter" },
        { status: 400 }
      );
    }
    const axios = GetAxiosInstance(req);
    const response = await axios.get<Book[]>(`/google-books?query=${query}`);
    const books = response.data ?? [];
    return NextResponse.json({ result: books }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error getting google books", getUserIdFromRequest(req), {
      data: {
        query,
      },
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
