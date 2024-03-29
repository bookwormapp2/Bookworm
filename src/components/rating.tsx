// use client
import * as React from "react";
// Next.js Image component for optimized image serving
import { Button } from "./ui/button"; // Adjust the import path as necessary
import Loading from "./ui/loading";

type StarProps = {
  filled?: boolean;
  user?: boolean;
  className?: string;
  imageFill?: boolean;
  onClick?: () => void;
};

function clamp(num: number, min: number, max: number): number {
  return Math.min(num, max);
}

export const RatingStar: React.FC<StarProps> = ({
  imageFill,
  filled,
  user,
  className,
  onClick,
}) => {
  const starSrc = filled
    ? user
      ? "/starUser.svg"
      : "/star.svg"
    : "/starEmpty.svg"; // Assuming you have an 'star-empty.svg' for empty stars
  return (
    <div className={className}>
      {imageFill ? (
        <img src={starSrc} alt="Star" onClick={onClick} />
      ) : (
        <img
          src={starSrc}
          alt="Star"
          width={22}
          height={22}
          onClick={onClick}
        />
      )}
    </div>
  );
};

type RatingProps = {
  rating?: number | null;
  totalRatings?: number | null;
  userRating?: number | null;
  goodreadsUrl?: string | null;
  loading?: boolean;
  className?: string;
};

const Rating: React.FC<RatingProps> = ({
  rating,
  totalRatings,
  goodreadsUrl,
  userRating,
  loading,
  className,
}) => {
  const fullStars = clamp(rating ? Math.round(rating) : 0, 0, 5);
  const emptyStars = clamp(5 - fullStars, 0, 5);
  const fullStarsUser = clamp(userRating ? Math.round(userRating) : 0, 0, 5);
  const emptyStarsUser = clamp(5 - fullStarsUser, 0, 5);

  const RatingLoading = () => (
    <div
      className={`flex items-center justify-start w-content py-4 rounded-full bg-primary-foreground ${
        className ?? ""
      }`}
    >
      <Loading />
    </div>
  );

  const Stars = ({ user }: { user?: boolean }) => (
    <div className={`flex items-center justify-start gap-1 ${className ?? ""}`}>
      {[...Array(user ? fullStarsUser : fullStars)].map((_, index) => (
        <RatingStar
          key={index}
          filled
          user={user}
          className="inline-block w-4 h-4"
        />
      ))}
      {[...Array(user ? emptyStarsUser : emptyStars)].map((_, index) => (
        <RatingStar key={index} className="inline-block w-4 h-4" />
      ))}
      <p className="ms-1 text-lg font-thin text-foreground">
        {(user ? userRating : rating)?.toFixed(2)}
        {!user && totalRatings && ` (${totalRatings})`}
      </p>
      <p className="ms-1 text-sm font-thin text-foreground">
        {/* ({user ? "Yours" : "Goodreads"}) */}
      </p>
    </div>
  );

  const RatingComponent = ({
    user,
    className,
  }: {
    user?: boolean;
    className?: string;
  }) => {
    return (
      <div
        className={`flex items-center justify-start w-fit rounded-full
      ${user ? "py-2.5" : ""}
      ${className ?? ""}
      `}
      >
        <Stars user={user} />
      </div>
    );
  };
  return (
    <>
      {loading ? (
        <RatingLoading />
      ) : (
        <div className={`flex flex-col gap-2 ${className ?? ""}`}>
          {userRating !== undefined &&
            userRating != null &&
            (fullStarsUser ?? 0) > 0 && <RatingComponent user />}
          {rating != null && rating !== undefined && <RatingComponent />}
        </div>
      )}
    </>
  );
};

export default Rating;
