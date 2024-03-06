import { Logger } from "@/src/logger";
import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance } from "@/src/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";
import {
  BooksList,
  BooksListData,
  CreateBooksListPayload,
} from "../../../../models/booksList";

const URL = "/list/book";

export async function POST(req: NextRequest) {
  let createBookInList: {bookId: string, listId: string} | null = null;
  try {
    createBookInList = await req.json();
    const axios = GetAxiosInstance(req);
    const response = await axios.post<BooksList>(URL, createBookInList);

    const userBook = response.data;

    return NextResponse.json(
      {
        result: userBook,
      },
      { status: 200 }
    );
  } catch (error: any) {
    Logger.error("Error creating user book", {
      data: {
        createBookInList,
      },
      error,
    });

    return NextResponse.json({}, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest
): Promise<NextResponse<IResponse<void>>> {
  let bookId: string | null = null;
  let listId: string | null = null;
  try {
    const url = req.nextUrl;
    listId = url.searchParams.get("listId") as string;
    bookId = url.searchParams.get("bookId") as string;
    const axios = GetAxiosInstance(req);
    const urlParams = new URLSearchParams();
    urlParams.append("listId", listId);
    urlParams.append("bookId", bookId);

    const response = await axios.delete<IResponse<void>>(URL, {
      params: urlParams,
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    Logger.error("Error deleting book from list", {
      data: {
        listId,
        bookId,
      },
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}