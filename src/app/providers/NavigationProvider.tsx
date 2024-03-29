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
  const { user, state } = useSelector(selectAuth);

  useEffect(() => {
    if (!user && state !== AuthStateType.SIGNED_IN) {
      const currentPathname = pathname;
      if (pathname !== "/home") {
        router.push("/home");
        if (pathname.includes("/lists/")) {
          router.push(currentPathname);
        }
      }
    } else {
      const redirect = localStorage.getItem("redirect");
      if (redirect) {
        router.push(redirect);
      }
    }
  }, [user]);

  return <>{children}</>;
};

export default NavigationProvider;
