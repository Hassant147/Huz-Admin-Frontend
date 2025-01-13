import React, { useEffect, useState } from "react";
import arrow from "../../../../assets/star.svg";
import Loader from "../../../../components/loader";
import {getOverPartnerRating} from "../../../../utility/Api";

const RatingSystem = () => {
  const [ratings, setRatings] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchRatingData = async () => {
      const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
      if (profile) {
        try {
          const result = await getOverPartnerRating(profile.partner_session_token);
          if (result.error) {
            setApiError(result.error);
          } else {
            setRatings([
              { stars: 5, count: result.total_star_5 },
              { stars: 4, count: result.total_star_4 },
              { stars: 3, count: result.total_star_3 },
              { stars: 2, count: result.total_star_2 },
              { stars: 1, count: result.total_star_1 },
            ]);
            setTotalReviews(
              result.total_star_5 +
              result.total_star_4 +
              result.total_star_3 +
              result.total_star_2 +
              result.total_star_1
            );
          }
        } catch (error) {
          setApiError("Error fetching ratings");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRatingData();
  }, []);

  const averageRating =
    totalReviews > 0
      ? ratings.reduce(
          (total, item) => total + item.stars * item.count,
          0
        ) / totalReviews
      : 0;

  if (isLoading) {
    return <Loader />;
  }

  if (apiError) {
    return <div>Error: {apiError}</div>;
  }

  return (
    <div className="flex bg-white w-full rounded-lg shadow-custom-box">
      <div className="flex flex-col h-28y w-[30%] justify-center items-center">
        <div className="text-[#00936C] text-[30px] md:text-[50px] flex items-center font-bold">
          {averageRating === 0 ? (
            <div className=" flex justify-center items-center w-full">0.0</div>
          ) : (
            averageRating.toFixed(1)
          )}
        </div>
        <p className="text-sm text-[#00936c]"> Overall Rating & Review</p>
      </div>

      <div className="flex-1 p-8 px-16 ">
        {ratings.map((rating, index) => (
          <div key={index} className="flex items-center py-1">
            <div className="text-[#4B465C] font-medium text-sm w-8 flex items-center gap-1">
              {rating.stars}
              <img src={arrow} alt="" className="size-[15px]" />
            </div>
            <div className="bg-[#C1C9C7] rounded-full overflow-hidden flex-1 mx-4">
              <div
                style={{
                  width: `${
                    (totalReviews > 0 ? rating.count / totalReviews : 0) * 100
                  }%`,
                }}
                className={`h-[6px] rounded-full ${
                  totalReviews > 0 ? "bg-[#00936C]" : "bg-gray-400"
                }`}
              ></div>
            </div>
            <div className="w-12 text-right text-sm text-[#4b465c]">
              {rating.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSystem;
