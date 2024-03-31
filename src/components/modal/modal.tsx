"use client";

import { motion } from "framer-motion";
import React, {
  HTMLAttributes,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoArrowBack } from "react-icons/io5";
import { ExpandType, ExpandingDiv, OpacityDiv } from "../animationDivs";
import SizeContext from "../../lib/context/sizeContext";
import { EventTracker } from "../../eventTracker";

interface ContentDivProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  innerRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  backgroundColor?: string;
  topBarCollapsed: React.ReactNode;
  onClose?: () => void;
  className?: string;
  shouldAnimate?: boolean;
  children?: React.ReactNode;
}

const TopBarCollapsed = ({
  children,
  scrollRef,
  onClose,
}: {
  onClose?: () => void;
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
}) => {
  const [currentScrollPosition, setScrollPosition] = useState<number>(0);

  const handleScroll = () => {
    const scrollTop = scrollRef?.current?.scrollTop ?? 0;
    if (scrollTop > 120) {
      const scrolled = (scrollRef?.current?.scrollTop ?? 0) / 240;
      setScrollPosition(scrolled);
    } else {
      setScrollPosition(0);
    }
  };

  // record event onPopState
  useEffect(() => {
    const handleBackButtonClick = () => {
      EventTracker.track("modal back button click");
    };
    window.addEventListener("popstate", handleBackButtonClick);

    return () => window.removeEventListener("popstate", handleBackButtonClick);
  }, []);

  useEffect(() => {
    const scrollbar = scrollRef?.current;
    if (!scrollbar) return;
    scrollbar.addEventListener("scroll", handleScroll);
    return () => scrollbar.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  return (
    <div
      className="w-full h-fit bg-background fixed top-0 left-0 z-30 flex justify-start items-center flex-shrink-0"
      style={{ opacity: currentScrollPosition }}
    >
      <BackButton onClick={onClose} className="!top-2 !left-2 fixed" />
      {children}
    </div>
  );
};

const BackButton = ({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) => (
  <motion.div
    className={`h-6 w-6 absolute top-[25px] left-[31px] z-30 ${className}`}
    whileHover={{ scale: 1.2 }}
  >
    <div
      className="bg-background h-10 w-10 rounded-full shadow-sm shadow-background flex justify-center items-center"
      onClick={onClick}
    >
      <IoArrowBack className="!text-foreground !w-6 !h-6" />
    </div>
  </motion.div>
);

const Modal: React.FC<ModalProps> = ({
  isOpen,
  backgroundColor,
  topBarCollapsed,
  onClose,
  className,
  children,
  shouldAnimate = true,
}) => {
  const { width, height } = useContext(SizeContext);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBackButtonClick = () => {
      onClose?.();
    };
    window.addEventListener("popstate", handleBackButtonClick);

    return () => window.removeEventListener("popstate", handleBackButtonClick);
  }, []);

  const ContentDiv: React.FC<ContentDivProps> = ({}) =>
    useMemo(() => {
      const key = "modal";
      const className = "h-4/5 max-h-fit w-full bg-background rounded-t-5xl";
      const onClick = (e: any) => e.stopPropagation();

      return shouldAnimate ? (
        <ExpandingDiv
          key={key}
          className={className}
          onClick={onClick}
          isOpen={isOpen}
          expandType={ExpandType.Modal}
        >
          {children}
        </ExpandingDiv>
      ) : (
        <div key={key} className={className} onClick={onClick}>
          {children}
        </div>
      );
    }, [isOpen, children]);

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-50 overscroll-none overflow-auto bg-background"
      style={{ height, width }}
      ref={scrollableDivRef}
      id="modal"
    >
      <TopBarCollapsed scrollRef={scrollableDivRef} onClose={onClose}>
        {topBarCollapsed}
      </TopBarCollapsed>
      <OpacityDiv innerRef={modalRef} key="modal-background" isOpen={isOpen}>
        <div
          className="w-full h-full overscroll-none bg-background relative"
          ref={scrollableDivRef}
        >
          <BackButton onClick={onClose} />
          <div className="flex justify-center items-center relative w-full h-full z-20 pb-4">
            <div
              className={`relative z-40 w-full h-full flex items-end justify-start ${
                className ?? ""
              } z-10`}
              style={{ backgroundColor: backgroundColor ?? "rgb(12, 12, 12)" }}
              onClick={onClose}
            >
              <ContentDiv
                key="modal"
                className="h-4/5 max-h-fit w-full bg-background rounded-t-5xl"
                isOpen={isOpen}
                onClick={(e) => e.stopPropagation()}
              >
                {children}
              </ContentDiv>
            </div>
          </div>
        </div>
      </OpacityDiv>
    </div>
  );
};

export default Modal;
