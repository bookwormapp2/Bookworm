import React from "react";
import { IconBaseProps } from "react-icons";
import { VscFeedback } from "react-icons/vsc";
import { FaBookmark, FaShare, FaFilter } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import {
  FaHouse,
  FaPlus,
  FaBarsStaggered,
  FaBookMedical,
} from "react-icons/fa6";
import { FaSliders } from "react-icons/fa6";
import { CiMenuBurger, CiSearch } from "react-icons/ci";
import { MdCancel, MdPrivacyTip, MdClear } from "react-icons/md";
import { GiCircle } from "react-icons/gi";
import { IconSize, SpecialIconSize, getIconSize } from "../../consts/icon";
import { PiSignOutFill } from "react-icons/pi";

export type Icon = {
  Fill: React.ElementType<IconProps>;
  Outline: React.ElementType<IconProps>;
};

interface IconProps extends IconBaseProps {
  iconSize: IconSize;
}

const IconFill =
  (
    Icon: React.FC<IconBaseProps>,
    specialIcon?: SpecialIconSize
  ): React.ElementType<IconProps> =>
  ({ iconSize, ...props }: IconProps) => {
    const { heightPx, widthPx } = getIconSize({ size: iconSize, specialIcon });

    return (
      <Icon
        {...props}
        style={{
          height: heightPx,
          width: widthPx,
        }}
        className={`text-primary ${props.className} !w-[${widthPx}] !h-[${heightPx}]`}
      />
    );
  };

const IconOutline =
  (
    Icon: React.FC<IconBaseProps>,
    className?: string,
    specialIcon?: SpecialIconSize
  ): React.ElementType<IconProps> =>
  ({ iconSize, ...props }: IconProps) => {
    const { heightPx, widthPx } = getIconSize({ size: iconSize, specialIcon });
    return (
      <Icon
        {...props}
        style={{
          height: heightPx,
          width: widthPx,
        }}
        className={`text-foreground ${className ?? ""} ${props.className}`}
      />
    );
  };

export const Add: Icon = {
  Fill: IconFill(IoAddCircle),
  Outline: IconOutline(IoAddCircle),
};

export const Bookmark: Icon = {
  Fill: IconFill(FaBookmark, SpecialIconSize.Bookmark),
  Outline: IconOutline(FaBookmark, SpecialIconSize.Bookmark),
};

export const Checkmark: Icon = {
  Fill: IconFill(IoIosCheckmarkCircle),
  Outline: IconOutline(IoIosCheckmarkCircle),
};

export const NavigationHome: Icon = {
  Fill: IconFill(FaHouse),
  Outline: IconOutline(FaHouse, "text-background"),
};

export const NavigationLists: Icon = {
  Fill: IconFill(FaBookMedical),
  Outline: IconOutline(FaBookMedical, "text-background"),
};

export const BurgerMenu: Icon = {
  Fill: IconFill(FaBarsStaggered),
  Outline: IconOutline(FaBarsStaggered),
};

export const BurgerLines: Icon = {
  Fill: IconFill(CiMenuBurger),
  Outline: IconOutline(CiMenuBurger),
};

export const Plus: Icon = {
  Fill: IconFill(FaPlus),
  Outline: IconOutline(FaPlus),
};

export const Sliders: Icon = {
  Fill: IconFill(FaSliders),
  Outline: IconOutline(FaSliders),
};

export const Cancel: Icon = {
  Fill: IconFill(MdCancel),
  Outline: IconOutline(MdCancel),
};

export const Circle: Icon = {
  Fill: IconFill(GiCircle),
  Outline: IconOutline(GiCircle),
};

export const Share: Icon = {
  Fill: IconFill(FaShare),
  Outline: IconOutline(FaShare),
};

export const Filter: Icon = {
  Fill: IconFill(FaFilter),
  Outline: IconOutline(FaFilter),
};

export const Feedback: Icon = {
  Fill: IconFill(VscFeedback),
  Outline: IconOutline(VscFeedback),
};

export const Privacy: Icon = {
  Fill: IconFill(MdPrivacyTip),
  Outline: IconOutline(MdPrivacyTip),
};

export const SignOut: Icon = {
  Fill: IconFill(PiSignOutFill),
  Outline: IconOutline(PiSignOutFill),
};

export const Search: Icon = {
  Fill: IconFill(CiSearch),
  Outline: IconOutline(CiSearch),
};

export const Clear: Icon = {
  Fill: IconFill(MdClear),
  Outline: IconOutline(MdClear),
};