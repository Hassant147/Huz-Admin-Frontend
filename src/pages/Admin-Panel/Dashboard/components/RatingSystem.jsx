import React, { useEffect, useMemo, useState } from "react";
import arrow from "../../../../assets/star.svg";
import Loader from "../../../../components/loader";
import { getOverPartnerRating } from "../../../../utility/Api";
import { AppCard } from "../../../../components/ui";
import { getPartnerSessionToken } from "../../../../utility/session";

const RatingSystem = () => {
  const [ratings, setRatings] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const result = await getOverPartnerRating(getPartnerSessionToken());
        if (result.error) {
          setApiError(result.error);
          return;
        }

        const normalizedRatings = [
          { stars: 5, count: result.total_star_5 },
          { stars: 4, count: result.total_star_4 },
          { stars: 3, count: result.total_star_3 },
          { stars: 2, count: result.total_star_2 },
          { stars: 1, count: result.total_star_1 },
        ];

        setRatings(normalizedRatings);
        setTotalReviews(
          normalizedRatings.reduce((sum, item) => sum + Number(item.count || 0), 0)
        );
      } catch (error) {
        setApiError("Error fetching ratings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatingData();
  }, []);

  const averageRating = useMemo(() => {
    if (totalReviews <= 0) {
      return 0;
    }

    return (
      ratings.reduce((total, item) => total + item.stars * item.count, 0) / totalReviews
    );
  }, [ratings, totalReviews]);

  if (isLoading) {
    return (
      <AppCard className="min-h-[220px] flex items-center justify-center">
        <Loader />
      </AppCard>
    );
  }

  if (apiError) {
    return <AppCard className="text-sm text-red-500">Error: {apiError}</AppCard>;
  }

  return (
    <AppCard className="flex flex-col gap-4 lg:flex-row border-slate-200">
      <div className="flex w-full flex-col items-center justify-center lg:w-[30%]">
        <div className="flex items-center text-[36px] font-bold text-brand-600 md:text-[50px]">
          {averageRating === 0 ? "0.0" : averageRating.toFixed(1)}
        </div>
        <p className="text-sm text-brand-600">Overall Rating &amp; Review</p>
      </div>

      <div className="flex-1 space-y-2 lg:px-6">
        {ratings.map((rating) => (
          <div key={rating.stars} className="flex items-center py-1">
            <div className="flex w-8 items-center gap-1 text-sm font-medium text-[#4B465C]">
              {rating.stars}
              <img src={arrow} alt="" className="size-[15px]" />
            </div>
            <div className="mx-4 flex-1 overflow-hidden rounded-full bg-[#C1C9C7]">
              <div
                style={{
                  width: `${(totalReviews > 0 ? rating.count / totalReviews : 0) * 100}%`,
                }}
                className={`h-[6px] rounded-full ${
                  totalReviews > 0 ? "bg-[#00936C]" : "bg-gray-400"
                }`}
              />
            </div>
            <div className="w-12 text-right text-sm text-[#4b465c]">{rating.count}</div>
          </div>
        ))}
      </div>
    </AppCard>
  );
};

export default RatingSystem;
