import React, { useEffect, useRef, useState } from "react";
import { BooksListData } from "../../models/booksList";
import { ThumbnailSize } from "../../consts/thumbnail";
import { Add } from "../icons/add";
import { Cancel } from "../icons/cancel";
import { Checkmark } from "../icons/checkmark";
import BooksListThumbnail from "../booksList/booksListThumbnail";
import useBooksList from "../../hooks/useBooksList";
import { Book } from "../../models";
import useBook from "../../hooks/useBook";
import toast from "react-hot-toast";
import { DuplicateError } from "../../models/errors/duplicateError";
import BookDetails from "../book/bookDetails";
import { BookComponentProps } from "../search/BookSearchResult";
import { Logger } from "../../logger";
import { useFormik } from "formik";
import { Books } from "../../models/book";
import { TextArea } from "../textarea";
import SearchBar from "../search/searchBar";
import { ModalContent } from "./modalContainers";
import { BookInList, BookInListWithBook } from "../../models/bookInList";
import BookThumbnail from "../book/bookThumbnail";
import { CommentsArea } from "./_components/commentsArea";
import BookDetailsSkeleton from "../skeletons/BookDetailsSkeleton";

interface ModalBooksListProps {
  booksListData?: BooksListData;
}

interface ListBookAndBookDetailsProps {
  onAddNewBookClick: () => void;
  onDeleteBookClick: (bookInList: BookInList) => void;
  onChange: (
    bookInListWithBook: BookInListWithBook | null | undefined,
    comment: string
  ) => void;
  value: string;
  name: string;
  key?: string;
}

interface ListBookProps extends ListBookAndBookDetailsProps {
  booksInList?: BookInListWithBook[];
}

interface BookInListDetailsProps extends ListBookAndBookDetailsProps {
  bookInList?: BookInListWithBook;
}

const Thumbnail: React.FC<{
  books?: Books;
  thumbnailSize: ThumbnailSize;
  loading?: boolean;
}> = ({ books, thumbnailSize, loading }) => (
  <BooksListThumbnail
    books={books}
    thumbnailSize={thumbnailSize}
    loading={loading}
  />
);

const BookInListDetails: React.FC<BookInListDetailsProps> = ({
  bookInList,
  onDeleteBookClick,
  value,
  name,
  key,
}) => {
  return (
    <div className="w-full flex flex-row gap-2">
      <BookThumbnail
        book={bookInList?.book}
        className="flex-shrink-0"
        Icon={
          <div className="absolute-center overflow-hidden rounded-full">
            {bookInList?.book ? (
              <Cancel.Fill
                className="!text-foreground !bg-background border-none rounded-full p-1"
                iconSize="md"
                key={`delete-book-${bookInList.book.bookId}`}
                onClick={() => onDeleteBookClick(bookInList)}
              />
            ) : (
              <Add.Outline iconClassName="!text-foreground" iconSize="md" />
            )}
          </div>
        }
        thumbnailSize="sm"
      />

      <div className="w-full h-full flex flex-col justify-start items-start gap-2">
        <div
          className={`${
            bookInList ? "text-foreground" : "text-muted"
          } h-fit line-clamp-1`}
        >
          {bookInList?.book?.title ?? "Book Name"}
        </div>
        <CommentsArea key={key} name={name} bookInList={bookInList} />
      </div>
    </div>
  );
};

const ListBooks: React.FC<ListBookProps> = ({
  value,
  onChange,
  onAddNewBookClick,
  onDeleteBookClick,
  name,
  key,
  booksInList,
}) => (
  <div className="w-full flex flex-col gap-2 justify-center items-start">
    {booksInList?.map((bookInList, index) => (
      <BookInListDetails
        key={`${key}-book-in-modal-books-list-${index}`}
        bookInList={bookInList}
        onAddNewBookClick={onAddNewBookClick}
        onDeleteBookClick={onDeleteBookClick}
        onChange={onChange}
        value={value}
        name={`${name}-${bookInList.bookId}`}
      />
    ))}
    <div className="w-full flex flex-row gap-2">
      <BooksListThumbnail
        className="flex-shrink-0"
        Icon={
          <div className="absolute-center">
            <Add.Fill
              className="!text-foreground !bg-background border-none rounded-full p-1"
              iconSize="md"
              onClick={onAddNewBookClick}
            />
          </div>
        }
        thumbnailSize="sm"
      />

      <div className="w-full h-full flex flex-col justify-start items-start gap-2">
        <div className={`text-muted h-fit`}>Book Name</div>
        <TextArea
          value={value}
          rows={3}
          name={name}
          onChange={(e) => {
            onChange(null, e.target.value);
          }}
          placeholder="Comment"
          key={key}
        />
      </div>
    </div>
  </div>
);

const ModalBooksListEdit: React.FC<ModalBooksListProps> = ({
  booksListData,
}) => {
  const {
    createBooksList,
    addBookToList,
    removeBookFromList,
    loading: loadingList,
  } = useBooksList();
  const { addUserBook, getBookFullData, loading: loadingBook } = useBook();
  const [currentBooksList, setCurrentBookList] = useState<
    BooksListData | undefined
  >();
  const searchBarRef = useRef<HTMLDivElement>(null);
  const buildFormikValueName = (bookId: number) => `newBookComments-${bookId}`;

  const formik = useFormik({
    initialValues: {
      listName: booksListData?.name ?? "",
      newListDescription: booksListData?.description ?? "",
      newBookComments: "",
    },
    onSubmit: (values) => {},
  });

  useEffect(() => {
    setCurrentBookList(booksListData);
    booksListData?.booksInList?.forEach((bookInList) => {
      formik.setFieldValue(
        buildFormikValueName(bookInList.bookId),
        bookInList.comments
      );
    });
  }, [booksListData]);

  const scrollSearchBarIntoView = () => {
    searchBarRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    searchBarRef.current?.querySelector("input")?.focus();
  };

  const isBookInList = (book: Book) =>
    currentBooksList?.booksInList?.some(
      (bookInList) => bookInList.bookId === book.bookId
    );

  const handleDeleteBookClick = async (bookInList: BookInList) => {
    try {
      if (loadingList.current || loadingBook.current) return;
      if (!currentBooksList) return;

      await toast.promise(
        removeBookFromList(currentBooksList.listId, bookInList.bookId),
        {
          loading: `Removing book from list...`,
          success: `book removed from list successfully!`,
          error: `Failed to remove book from list.`,
        }
      );
      const newBooksInList = currentBooksList.booksInList?.filter(
        (book) => book.bookId !== bookInList.bookId
      );

      setCurrentBookList({
        ...currentBooksList,
        booksInList: newBooksInList,
      });
    } catch (e: any) {
      Logger.error("Error removing book from list", {
        data: {
          bookInList,
        },
        error: e,
      });
    }
  };

  const handleAddNewBookClick = async (book: Book) => {
    try {
      if (loadingList.current || loadingBook.current) return;

      if (!formik.values.listName) {
        formik.setFieldError("listName", "List name is required");
        return;
      }
      const newBooksComments = formik.values.newBookComments;
      let bookWithId = book;
      if (!book.bookId) {
        bookWithId = await toast.promise(
          (async () => {
            const userBook = await addUserBook({ book });
            return (
              getBookFullData(userBook.bookId)?.bookData.book ?? {
                ...book,
                bookId: userBook.bookId,
              }
            );
          })(),
          {
            loading: "Adding new book...",
            success: "Book added successfully!",
            error: "Failed to add book.",
          }
        );
      }

      if (currentBooksList) {
        await toast.promise(
          addBookToList(currentBooksList.listId, bookWithId),
          {
            loading: `Adding ${book.title} to list...`,
            success: `${book.title} added to list successfully!`,
            error: `Failed to add ${book.title} to list.`,
          }
        );

        const bookInList: BookInListWithBook = {
          bookId: bookWithId.bookId,
          listId: currentBooksList.listId,
          comments: newBooksComments,
          book: bookWithId,
        };
        const newBooksInList = [...(currentBooksList.booksInList ?? [])];
        newBooksInList.push(bookInList);
        setCurrentBookList({
          ...currentBooksList,
          booksInList: newBooksInList,
        });
      } else {
        const createBooksListResponse = await toast.promise(
          createBooksList({
            name: formik.values.listName,
            description: formik.values.newListDescription,
            booksInList: [
              {
                bookId: bookWithId.bookId,
                comments: formik.values.newBookComments,
              },
            ],
          }),
          {
            loading: "Creating new list...",
            success: "New list created successfully!",
            error: (e) =>
              e instanceof DuplicateError
                ? "You already have a list with the same name 🤔"
                : "Failed to create list.",
          }
        );
        setCurrentBookList(createBooksListResponse);
      }
      if (formik.values.newBookComments === newBooksComments) {
        formik.setFieldValue("newBookComments", "");
      }
    } catch (e: any) {
      Logger.error("Error adding book to list", {
        data: {
          book,
          newBookComments: formik.values.newBookComments,
        },
        error: e,
      });
    }
  };

  const SearchResult: React.FC<BookComponentProps> = ({ book }) => (
    <BookDetails
      book={book}
      bookThumbnailSize="sm"
      Icon={
        isBookInList(book) ? (
          <Checkmark.Fill className="flex-shrink-0" iconSize="md" />
        ) : (
          <Add.Outline
            className="flex-shrink-0"
            iconSize="xs"
            onClick={() => {
              handleAddNewBookClick(book);
            }}
          />
        )
      }
    />
  );

  return (
    <ModalContent
      thumbnail={
        <Thumbnail
          books={currentBooksList?.booksInList?.map(
            (bookInList) => bookInList.book
          )}
          thumbnailSize="lg"
        />
      }
      thumbnailDetails={
        <div className="flex flex-col w-full gap-2">
          <CommentsArea
            key={`${currentBooksList?.listId}-title`}
            value={booksListData ? undefined : formik.values.listName}
            onChange={
              booksListData
                ? undefined
                : (e) => {
                    formik.setFieldValue("listName", e.target.value);
                  }
            }
            name="listName"
            bookListData={currentBooksList}
            className="w-full"
            listName
            rows={1}
            error={formik.errors.listName}
            placeholder="List name"
          />
          <CommentsArea
            key={`${currentBooksList?.listId}-description`}
            name="listComments"
            onChange={(e) => {
              formik.setFieldValue("newListDescription", e.target.value);
            }}
            bookListData={currentBooksList}
            className="w-full"
          />
        </div>
      }
      bottomSection={
        <div
          className="w-full h-full flex flex-col gap-2 overflow-auto scrollbar-hide pb-4"
          key="modal-books-list"
        >
          <div className="flex flex-col gap-2">
            <ListBooks
              value={formik.values.newBookComments}
              onDeleteBookClick={(bookInList) => {
                handleDeleteBookClick(bookInList);
              }}
              onChange={(bookInList, comment) => {
                if (!bookInList) {
                  formik.setFieldValue("newBookComments", comment);
                } else if (bookInList?.book) {
                  formik.setFieldValue(
                    buildFormikValueName(bookInList.book.bookId),
                    comment
                  );
                }
              }}
              key={currentBooksList?.listId}
              onAddNewBookClick={() => {
                scrollSearchBarIntoView();
              }}
              name="newBookComments"
              booksInList={currentBooksList?.booksInList?.map(
                (bookInList) => bookInList
              )}
            />
            <div ref={searchBarRef}>
              <SearchBar
                onSearch={() => {
                  scrollSearchBarIntoView();
                }}
                CustomSearchItem={SearchResult}
                CustomSearchItemSkeleton={() => (
                  <div className="flex flex-col gap-2">
                    {Array.from(Array(5)).map((_, index) => (
                      <BookDetailsSkeleton
                        key={`book-details-skeleton-${index}`}
                        bookThumbnailSize="sm"
                      />
                    ))}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      }
    ></ModalContent>
  );
};

export default ModalBooksListEdit;
