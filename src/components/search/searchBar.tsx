"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "../input";
import useSearch, { UseSearchResult } from "../../hooks/useSearch";
import SearchItem from "./searchItem";

export interface SearchBarProps {
  className?: string;
  onChange?: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  onChange,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchValue, setSearchValue, data }: UseSearchResult = useSearch();

  const handleSearch = async (event: any) => {
    event.preventDefault();
    if (event.target) {
      setSearchValue(event.target.value);
    }
  };

  const classItems = "";
  const classNoItems = "";

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div
        className={`w-full flex justify-between items-center bg-secondary 
        ${
          data && data.length > 0
            ? "px-6 py-4 rounded-t-3xl rounded-b-lg"
            : "rounded-full"
        }
        ${className}`}
      >
        <form
          onChange={handleSearch}
          onSubmit={handleSearch}
          className={`w-full`}
        >
          <label
            htmlFor="search-bar"
            className="relative flex flex-row w-full bg-secondary rounded-full px-6 py-4"
          >
            <Image src="search.svg" alt="Search" height={32} width={32} />
            <Input
              type="text"
              id="search-bar"
              className="py-2 w-full h-full rounded-full bg-secondary text-white placeholder-gray-300 focus:outline-none border-none"
              placeholder="Search for the book"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </form>
      </div>
      <div>
        {data && data.length > 0 && (
          <div className="flex flex-col gap-1 overflow-auto">
            <div>Top 3 Results</div>
            {data.map(
              (book, i) =>
                i < 3 && (
                  <SearchItem
                    key={
                      book.title + book.isbn10 + book.datePublished + book.isbn
                    }
                    title={book.title}
                    author={book.authors ? book.authors.join(", ") : "Unknown"}
                    pageCount={book.numberOfPages ?? 0}
                    thumbnail={book.thumbnailUrl}
                    onAddToLibrary={() => {}}
                  />
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
