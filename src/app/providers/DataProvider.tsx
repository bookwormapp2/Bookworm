"use client";

import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { AuthStateType, selectAuth } from "../../lib/features/auth/authSlice";
import useBook from "../../hooks/useBook";
import { Logger } from "@/src/logger";
import useBooksList from "../../hooks/useBooksList";

interface DataProviderProps {
  children?: React.ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { loadUserBooks } = useBook();
  const { loadUserBooksLists } = useBooksList();
  const { user, state } = useSelector(selectAuth);
  const loadingUserBooks = useRef<boolean>(false);

  useEffect(() => {
    const loadUserDataAsync = async () => {
      try {
        if (loadingUserBooks.current) return;
        loadingUserBooks.current = true;
        Promise.allSettled([
          loadUserBooksLists(user),
          loadUserBooks(user),
        ]).finally(() => {
          loadingUserBooks.current = false;
        });
      } catch (error: any) {
        Logger.error("Error loading user books", { error });
      } finally {
        loadingUserBooks.current = false;
      }
    };
    if (state === AuthStateType.SIGNED_IN && user) {
      loadUserDataAsync();
    }
  }, [state, user]);

  return <>{children}</>;
};

export default DataProvider;
