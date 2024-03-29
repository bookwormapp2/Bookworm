import { Book } from "../../../../models";
import { BooksListData } from "../../../../models/booksList";
import { getAverageColor } from "../../_utils/thumbnailUtils";

async function setThumbnailColorsToBooksInList(books: Book[]): Promise<Book[]> {
  const batchSize = 100;
  const booksInListWithColors: Book[] = [];
  for (let i = 0; i < books.length; i += batchSize) {
    const batch = books.slice(i, i + batchSize);
    const colorPromises = batch.map(async (book) => {
      if (!book.thumbnailUrl || book.thumbnailColor) {
        return book;
      }
      const thumbnailColor = await getAverageColor(book.thumbnailUrl);
      return {
        ...book,
        thumbnailColor,
      };
    });

    const newBooksWithColors: Book[] = await Promise.all(colorPromises);
    booksInListWithColors.push(...newBooksWithColors);
  }
  return booksInListWithColors;
}

export async function setThumbnailColorsToBooksListData(
  booksListData: BooksListData[]
): Promise<BooksListData[]> {
  try {
    for (const booksList of booksListData) {
      const books = booksList.booksInList?.map((bookInList) => bookInList.book);
      if (!books) {
        continue;
      }
      const booksWithColors = await setThumbnailColorsToBooksInList(books);
      booksList.booksInList = booksWithColors.map((book, index) => {
        return {
          ...booksList.booksInList[index],
          book,
        };
      });
    }
    return booksListData;
  } catch (error: any) {
    return booksListData;
  }
}

export async function setThumbnailColorsToBooks(
  books: Book[]
): Promise<Book[]> {
  try {
    let booksWithColors: Book[] = [];
    for (const book of books) {
      if (!book.thumbnailUrl || book.thumbnailColor) {
        booksWithColors.push(book);
      } else {
        const thumbnailColor = await getAverageColor(book.thumbnailUrl);
        booksWithColors.push({
          ...book,
          thumbnailColor,
        });
      }
    }
    return booksWithColors;
  } catch (error: any) {
    return books;
  }
}
