import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserBooks } from "../lib/features/userBooks/userBooksSlice";
import { UserBookData } from "../models";
import { Logger } from "../logger";
import { BookFilter, BookSort } from "./useBook";
import {
  sortByTitle,
  sortByAuthor,
  sortByDateAdded,
  filterByReadlist,
} from "../utils/bookUtils";
import { ReadingStatusEnum } from "../models/readingStatus";
import { BooksListData } from "../models/booksList";

enum TableType {
  READ = 1,
  TO_READ = 2,
}

const useTable = () => {
  const { userBooksData, loading, error } = useSelector(selectUserBooks);

  const currentTableType = useRef<TableType>(TableType.TO_READ);
  const [userBooks, setUserBooks] = useState<UserBookData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);
  const [readBooksCount, setReadBooksCount] = useState(0);
  const [toReadBooksCount, setToReadBooksCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [sortedBy, setSortedBy] = useState<BookSort>();
  const [filteredBy, setFilteredBy] = useState<
    {
      filter: BookFilter;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    updateUserBooks(currentPage, currentTableType.current, searchValue);
  }, [userBooksData, currentPage]);

  const getSearchBooks = (value: string = "") => {
    return [...userBooksData].filter(
      (userBook) =>
        userBook.bookData?.book?.title
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        userBook.bookData?.book?.authors?.some((author) =>
          author.toLowerCase().includes(value.toLowerCase())
        )
    );
  };

  const getFilteredBooks = (tableType: TableType, search: string) => {
    return getSearchBooks(search);
    // .filter(
    //   (userBook) => userBook.readingStatus?.readingStatusId === tableType
    // );
  };

  const updateUserBooks = (
    page: number,
    tableType: TableType,
    search: string = ""
  ) => {
    let newUserBooks = getFilteredBooks(tableType, search).slice(
      0,
      page * pageSize
    );

    setUserBooks(newUserBooks);
    setTotalRecords(userBooksData.length);
    const readBooks = userBooksData.filter(
      (userBook) =>
        userBook.readingStatus?.readingStatusId === ReadingStatusEnum.READ
    );
    const toReadBooks = userBooksData.filter(
      (userBook) =>
        userBook.readingStatus?.readingStatusId === ReadingStatusEnum.TO_READ
    );
    setReadBooksCount(readBooks.length);
    setToReadBooksCount(toReadBooks.length);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => {
      return prevPage + 1;
    });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const updateTableType = (newTableType: TableType) => {
    currentTableType.current = newTableType;
    setCurrentPage(1);
    updateUserBooks(1, newTableType);
    setSearchValue("");
  };

  const filterBooks = (
    filter?: BookFilter,
    value?: string,
    booksLists: BooksListData[] = [],
    userBooksToFilter: UserBookData[] = userBooks
  ): UserBookData[] => {
    let filters = [...filteredBy];
    let filteredBooks = [...userBooksToFilter];
    if (filter && value) {
      const isFilterInUse = filteredBy?.find((f) => f.value === value);
      if (!isFilterInUse) {
        filters.push({ filter, value });
      } else {
        filters = filters.filter((f) => f.value !== value);
      }
    }

    try {
      for (const { filter, value } of filters) {
        switch (filter) {
          case "readlist":
            filteredBooks = filterByReadlist(
              value,
              [...filteredBooks],
              [...booksLists]
            );
            break;
        }
      }
      setFilteredBy(filters);
      return sortedBy ? sortBooks(sortedBy, filteredBooks) : filteredBooks;
    } catch (error: any) {
      Logger.error("Error filtering books", {
        data: {
          filter,
          value,
        },
        error,
      });
      return userBooks;
    }
  };

  const sortBooks = (
    sort?: BookSort,
    userBookDataToSort: UserBookData[] = userBooks
  ): UserBookData[] => {
    try {
      let sortedUserBooks: UserBookData[] = userBookDataToSort;
      switch (sort) {
        case BookSort.Title:
          sortedUserBooks = sortByTitle([...userBookDataToSort]);
          break;
        case BookSort.Author:
          sortedUserBooks = sortByAuthor([...userBookDataToSort]);
          break;
        case BookSort.DateAdded:
          sortedUserBooks = sortByDateAdded([...userBookDataToSort]);
          break;
      }
      setSortedBy(sort);
      return sortedUserBooks;
    } catch (error: any) {
      Logger.error("Error sorting books", {
        data: {
          sort,
          userBookDataToSort,
        },
        error,
      });
      return userBookDataToSort;
    }
  };

  /**
   * Search books by title or author
   * @param value - search value
   */
  const searchBooks = (value: string) => {
    setSearchValue(value);
    updateUserBooks(3, currentTableType.current, value);
  };

  return {
    userBooks,
    loading,
    error,
    currentPage,
    pageSize,
    totalRecords,
    nextPage,
    handlePageSizeChange,
    updateTableType,
    searchBooks,
    searchValue,
    readBooksCount,
    toReadBooksCount,
    sortBooks,
    filterBooks,
    filteredBy,
  };
};

export default useTable;
