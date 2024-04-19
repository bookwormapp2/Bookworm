import React from "react";
import Rating from "../../rating";
import MarqueeText from "../../ui/marquee";
import Tooltip from "../../ui/tooltip";

const BookGeneralDetails: React.FC<{
  title?: string | null;
  authors?: string[] | null;
  goodreadsRating?: number | null;
}> = ({ title, authors, goodreadsRating }) => (
  <div className="h-full w-full flex flex-col gap-4 mt-2.5">
    <div>
      <Tooltip
        tooltipContent={
          <div className="w-fullfont text-foreground line-clamp-4">{title}</div>
        }
      >
        <MarqueeText
          text={title ?? ""}
          className="w-full text-left text-foreground line-clamp-1 font-bold text-xl"
        />
      </Tooltip>
      <div className="text-lg text-muted line-clamp-2">
        {authors?.join(", ")}
      </div>
    </div>
    <Rating rating={goodreadsRating} />
  </div>
);

export default BookGeneralDetails;
