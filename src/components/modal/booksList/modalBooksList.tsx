import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ModalContent } from ".././modalContainers";
import { SafeBooksListData } from "../../../models/booksList";
import BooksListThumbnail from "../../booksList/booksListThumbnail";
import useBooksList from "../../../hooks/useBooksList";
import useBook from "../../../hooks/useBook";
import ReadMoreText from "../../readMoreText";
import { ModalBooksListProps } from "./consts";
import Tooltip from "../../../components/tooltip";
import BooksListGridView from "./gridView";

export const ModalBooksList = <T extends SafeBooksListData>({
  booksListData,
}: ModalBooksListProps<T>) => {
  const router = useRouter();
  const { userBooksData } = useBook();
  const { booksLists } = useBooksList();

  useEffect(() => {
    if (!booksListData) return;
    const url = decodeURIComponent(booksListData.publicURL ?? "");
    window.history.pushState(window.history.state, "", url);
    return () => {
      if (window.history.state === null) {
        router.push("/lists");
      } else {
        window.history.pushState(window.history.state, "", "/lists");
      }
    };
  }, []);

  const booksInUsersListsCount: number = useMemo(() => {
    let booksInUsersLists = 0;
    if (booksListData) {
      const currentList = booksLists.find(
        (list) => list.name === booksListData.name
      );
      currentList?.booksInList.forEach((bookInList) => {
        if (bookInList.book) {
          const userHasBook = userBooksData.some(
            (userBookData) =>
              userBookData.bookData.book?.bookId === bookInList.book.bookId
          );
          if (userHasBook) {
            booksInUsersLists++;
          }
        }
      });
    }
    return booksInUsersLists;
  }, [booksListData, booksLists]);

  return (
    <ModalContent
      thumbnail={
        <BooksListThumbnail
          books={booksListData?.booksInList.map(
            (booksListData) => booksListData.book
          )}
          thumbnailSize="lg"
        />
      }
      thumbnailDetails={
        <div className="w-full h-full justify-start items-start">
          <Tooltip
            tooltipContent={
              <div className="text-lg text-muted line-clamp-4 max-w-xs">
                7 Books That Transformed My Career as a Software Engineer -
                Jordan Cutler
              </div>
            }
          >
            <div className="w-full flex text-start line-clamp-3 text-foreground font-bold text-xl relative">
              {booksListData?.name}
            </div>
          </Tooltip>
          <div className="line-clamp-1 text-muted text-lg">
            {booksListData?.curatorName}
          </div>
        </div>
      }
      buttonsRow={
        <div className="h-fit w-full flex">
          <ReadMoreText text={booksListData?.description} maxLines={2} />
        </div>
      }
      bottomSection={
        <BooksListGridView
          booksListData={booksListData}
          booksInUsersListsCount={booksInUsersListsCount}
        />
      }
    />
  );
};