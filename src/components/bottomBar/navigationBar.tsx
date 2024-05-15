"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { NavigationBarItem, navigationBarItems } from "./navigationBarItems";
import { getIconSize } from "../../consts/icon";
import { useModal } from "../../hooks/useModal";
import { Button } from "../ui/button";
import Avatar from "../../app/_components/avatar";
import { useAppSelector } from "../../lib/hooks";
import { cn } from "../../lib/utils";

const BottomNavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { clearStack } = useModal();
  const [selected, setSelected] = React.useState<NavigationBarItem | null>();

  useEffect(() => {
    const selected = navigationBarItems.find((item) =>
      pathname.includes(item.path)
    );
    setSelected(selected);
  }, [pathname]);

  return (
    <div className="w-full h-fit flex flex-row justify-center items-center z-20 fixed bottom-0 md:hidden">
      <div className="w-full h-15 flex items-center justify-center gap-[70px] rounded-xl fixed bottom-0 bg-background">
        {navigationBarItems.map((item) => {
          return (
            <Button
              data-ripple-light={false}
              data-ripple-dark={false}
              key={item.name}
              className="flex items-center justify-center rounded-full w-fit h-fit cursor-pointer bg-transparent p-0"
              onClick={() => {
                if (pathname.includes(item.path)) {
                  router.refresh();
                } else {
                  router.push(item.path);
                  clearStack();
                  setSelected(item);
                }
              }}
            >
              {selected?.path === item.path ? (
                <item.iconSelected
                  className={`${item.className} ${
                    getIconSize({
                      size: item.size,
                    }).className
                  } !text-primary`}
                />
              ) : (
                <item.icon
                  className={`${item.className} ${
                    getIconSize({
                      size: item.size,
                    }).className
                  } !text-foreground`}
                />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

const SideNavigationBar = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const { clearStack } = useModal();
  const [selected, setSelected] = React.useState<NavigationBarItem | null>();

  useEffect(() => {
    const selected = navigationBarItems.find((item) =>
      pathname.includes(item.path)
    );
    setSelected(selected);
  }, [pathname]);

  return (
    <div className="w-[264px] h-full hidden md:flex flex-col justify-start items-center z-20 fixed left-0 border-r-1 border-gray-600 bg-background pl-6 pt-10 gap-8">
      <div className="w-full flex flex-row justify-start items-center gap-1 flex-shrink-0">
        <div className="w-15 h-15">
          <Avatar
            avatarUrl={user?.profilePictureUrl}
            defaultText={user?.displayName || user?.email}
            imageClassName="!w-15 !h-15 flex-shrink-0"
          />
        </div>
        <div className="flex flex-col justify-start items-start">
          <span className="text-base">Welcome!</span>
          <span className="text-2xl leading-6">
            {user?.displayName || user?.email}
          </span>
        </div>
      </div>
      <div className="w-full h-fit">
        {navigationBarItems.map((item) => {
          return (
            <div className="w-full justify-start items-center h-15">
              <Button
                data-ripple-light={false}
                data-ripple-dark={false}
                key={item.name}
                className="flex items-center justify-start rounded-full w-fit h-fit cursor-pointer bg-transparent p-0 gap-4"
                onClick={() => {
                  if (pathname.includes(item.path)) {
                    router.refresh();
                  } else {
                    router.push(item.path);
                    clearStack();
                    setSelected(item);
                  }
                }}
              >
                <item.icon
                  className={cn("h-6 w-6", {
                    "text-primary": selected?.path === item.path,
                    "text-foreground": selected?.path !== item.path,
                  })}
                />
                <span
                  className={cn("text-xl", {
                    "text-primary": selected?.path === item.path,
                    "text-foreground": selected?.path !== item.path,
                  })}
                >
                  {item.name}
                </span>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const NavigationBar = () => {
  return (
    <>
      <BottomNavigationBar />
      <SideNavigationBar />
    </>
  );
};

export default NavigationBar;
