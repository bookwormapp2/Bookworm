"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { SearchBarComponent } from "../../components/search/searchBarComponent";
import useTable from "../../hooks/useTable";
import BookList from "../../components/book/bookList";
import BooksListList from "../../components/BooksListList/booksListList";
import { Plus } from "../../components/icons";
import { useDispatch } from "react-redux";
import {
  showModal,
  BottomSheetTypes,
} from "../../lib/features/modal/modalSlice";

const MyLists = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userBooks, nextPage, searchBooks } = useTable();

  const onSeeAllClick = useCallback(() => {
    router.push("/my-library");
  }, [router]);

  const onAddListClick = () => {
    dispatch(
      showModal({
        type: BottomSheetTypes.BOOKS_LIST_DETAILS,
      })
    );
  };

  const UserBooks = () => (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="w-full flex flex-row justify-between">
        <div className="text-xl font-bold">Books I've Read</div>
        <div className="text-lg font-bold underline" onClick={onSeeAllClick}>
          See all
        </div>
      </div>
      <BookList
        books={userBooks.map((ubd) => ubd.bookData.book)}
        onNextPageScroll={nextPage}
        direction="row"
      />
    </div>
  );

  const UserBooksLists = () => (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="w-full flex flex-row justify-between">
        <div className="text-xl font-bold">My lists</div>
        <div>
          <Plus.Fill
            className="w-6 h-6 !text-foreground"
            onClick={onAddListClick}
          />
        </div>
      </div>
      <div className="w-full">
        <BooksListList direction="column" />
      </div>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col relative justify-top items-start gap-4 p-3">
      <SearchBarComponent
        onChange={(value: string) => searchBooks(value)}
        onSubmit={(value: string) => searchBooks(value)}
        placeholder="Search in Your Books..."
      />
      <div className="w-full flex flex-col gap-3">
        <UserBooks />
        <UserBooksLists />
      </div>
    </div>
  );
};

export default MyLists;
