import { useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { Logger } from "../logger";
import {
  setBooksListsLoading,
  setBooksLists,
  addBooksList,
  updateBooksList as updateBooksListAction,
  deleteBooksList as deleteBooksListAction,
  addBookToList as addBookToListAction,
  removeBookFromList as removeBookFromListAction,
} from "../lib/features/booksLists/booksListsSlice";
import {
  BooksList,
  BooksListData,
  CreateBooksListPayload,
} from "../models/booksList";
import { Book, User } from "../models";
import { IResponse } from "../models/dto/response";
import { DuplicateError } from "../models/errors/duplicateError";

const useBooksList = () => {
  const loading = useRef(false);
  const dispatch = useDispatch();
  const booksLists = useSelector(
    (state: RootState) => state.booksLists.booksListsData
  );

  const loadUserBooksLists = async (user?: User | null) => {
    if (loading.current) {
      throw new Error(
        "Operation in progress. Please wait until the current operation completes."
      );
    }
    const booksList = JSON.parse(localStorage.getItem("booksList") ?? "[]");
    if (booksList) {
      if (Array.isArray(booksList)) {
        dispatch(setBooksLists([...booksList]));
      }
    }

    loading.current = true;
    dispatch(setBooksListsLoading(true));
    try {
      if (user) {
        axios.defaults.headers.common["Authorization"] = user.token;
        axios.defaults.headers.common["user_id"] = user.userId;
      }

      const response = await axios.get<IResponse<BooksListData[]>>("/api/list");
      const booksListsData = response.data;
      dispatch(setBooksLists(booksListsData.result ?? []));
      localStorage.setItem("booksList", JSON.stringify(booksListsData.result));
    } catch (error: any) {
      Logger.error("Failed to fetch users books lists", error);
    } finally {
      loading.current = false;
      dispatch(setBooksListsLoading(false));
    }
  };

  const createBooksList = async (booksListPayload: CreateBooksListPayload) => {
    try {
      loading.current = true;
      const response = await axios.post<IResponse<BooksListData>>(
        "/api/list",
        booksListPayload
      );
      const booksListData: BooksListData | undefined = response.data.result;
      if (booksListData) {
        dispatch(addBooksList(booksListData));
        localStorage.setItem(
          "booksList",
          JSON.stringify([...booksLists, booksListData])
        );
      }
    } catch (error: any) {
      Logger.error("Failed to create books list", error);
      if (error.response?.status === 409) {
        throw new DuplicateError("List with the same name already exists");
      }
      throw error;
    } finally {
      loading.current = false;
    }
  };

  const updateBooksList = async (booksList: BooksList) => {
    try {
      await axios.patch(`/api/list/`, booksList);
      dispatch(updateBooksListAction(booksList));
      localStorage.setItem(
        "booksList",
        JSON.stringify(
          booksLists.map((list) =>
            list.listId === booksList.listId ? booksList : list
          )
        )
      );
    } catch (error: any) {
      Logger.error("Failed to update books list", error);
    }
  };

  const deleteBooksList = async (listId: string) => {
    try {
      await axios.delete(`/api/list/${listId}`);
      dispatch(deleteBooksListAction(listId));
      localStorage.setItem(
        "booksList",
        JSON.stringify(booksLists.filter((list) => list.listId !== listId))
      );
    } catch (error: any) {
      Logger.error("Failed to delete books list", error);
    }
  };

  const addBookToList = async (listId: string, book: Book) => {
    try {
      await axios.post(`/api/list/book`, {
        listId,
        bookId: book.bookId,
      });
      dispatch(addBookToListAction({ listId, book }));
      localStorage.setItem(
        "booksList",
        JSON.stringify(
          booksLists.map((list) => {
            if (list.listId === listId) {
              return {
                ...list,
                booksInList: list.booksInList
                  ? [...list.booksInList, book]
                  : [book],
              };
            }
            return list;
          })
        )
      );
    } catch (error: any) {
      Logger.error("Failed to add book to list", error);
    }
  };

  const removeBookFromList = async (listId: string, bookId: number) => {
    try {
      const urlParams = new URLSearchParams();
      urlParams.append("listId", listId);
      urlParams.append("bookId", bookId.toString());

      await axios.delete(`/api/list/book`, {
        params: urlParams,
      });
      dispatch(removeBookFromListAction({ listId, bookId }));
      localStorage.setItem(
        "booksList",
        JSON.stringify(
          booksLists.map((list) => {
            if (list.listId === listId) {
              return {
                ...list,
                booksInList: list.booksInList?.filter(
                  (book) => book.bookId !== bookId
                ),
              };
            }
            return list;
          })
        )
      );
    } catch (error: any) {
      Logger.error("Failed to remove book from list", error);
    }
  };

  return {
    booksLists,
    loading: loading.current,
    loadUserBooksLists,
    createBooksList,
    updateBooksList,
    deleteBooksList,
    addBookToList,
    removeBookFromList,
  };
};

export default useBooksList;