"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { AuthStateType, selectAuth } from "../../lib/features/auth/authSlice";
import { usePathname, useRouter } from "next/navigation";

interface NavigationProviderProps {
  children?: React.ReactNode;
}

const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector(selectAuth);

  useEffect(() => {
    if (!user) {
      if (pathname !== "/") {
        router.push("/");
      }
    }
  }, [user]);

  return <>{children}</>;
};

export default NavigationProvider;