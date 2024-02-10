import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "./providers/StoreProvider";
import AuthProvider from "./providers/AuthProvider";
import React from "react";
import "./globals.css";
import Header from "./_components/header";
import { VideoBackground } from "../components";
import APIProvider from "./providers/APIProvider";
import { Toaster } from "react-hot-toast";
import DataProvider from "./providers/DataProvider";
import ModalProvider from "./providers/ModalProvider";
import AnimationProvider from "./providers/AnimationProvider";
import { EventTracker } from "../eventTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Bookworm",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If screen size is small (mobile, <640px), show a message to the user
  if (typeof window !== "undefined") {
    if (window.innerWidth < 640) {
      EventTracker.track("User visited from mobile");
    }
  }
  return (
    <html lang="en">
      <body
        className={`${inter.className} w-screen h-screen px-16 py-8 flex flex-col overflow-hidden overscroll-none sm:overscroll-auto`}
      >
        <StoreProvider>
          <AuthProvider>
            <APIProvider>
              <DataProvider>
                <div className="absolute top-0 left-0 right-0 bottom-0 w-screen h-screen">
                  <ModalProvider />
                </div>
                <div
                  id="portal"
                  className="absolute top-0 right-0 left-0 bottom-0 z-10"
                />
                <Header className="absolute top-0 mb-16 hidden sm:flex" />
                <div className="absolute top-0 right-0 left-0 bottom-0 z-0">
                  <VideoBackground />
                </div>
                <AnimationProvider>
                  <div className="h-full w-full z-10 relative !font-sans hidden sm:flex">
                    {children}
                  </div>
                  <div className="h-full w-full z-10 relative !font-sans flex justifty-center flex-col gap-4 sm:hidden">
                    <span className="text-xl">
                      Responsive design is in the works!
                    </span>
                    <span>
                      We'd love to see you here from the phone again soon :)
                    </span>
                    <span>
                      Come visit us from your computer or tablet though!
                    </span>
                  </div>
                </AnimationProvider>
                <Toaster />
              </DataProvider>
            </APIProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
