
import React, { useState, useEffect } from "react";
import arrow from "../../../assets/star.svg";
import Loader from "../../../components/loader";

const RatingSystem = ({ totalRatings, totalReviews }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };

    fetchData();
  }, []);

  const averageRating =
    totalReviews > 0
      ? totalRatings.reduce(
          (total, item) => total + item.stars * item.count,
          0
        ) / totalReviews
      : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-28 bg-white w-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex bg-white w-full rounded-lg shadow-custom-box">
      <div className="flex flex-col h-28 w-1/4 justify-center items-center">
        <div className="text-[#00936C] text-[30px] md:text-[50px] flex items-center font-bold">
          {averageRating === 0 ? (
            <div className="flex justify-center items-center w-full">0.0</div>
          ) : (
            averageRating.toFixed(1)
          )}
        </div>
        <p className="lg:text-xs xl:text-sm text-[#00936c]">Overall Rating & Review</p>
      </div>

      <div className="w-[70%] flex-1 p-5">
        {totalRatings.map((rating, index) => (
          <div key={index} className="flex items-center">
            <div className="text-[#4B465C] font-medium text-xs w-8 flex items-center gap-1">
              {rating.stars}
              <img src={arrow} alt="" className="size-[10px]" />
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
            <div className="w-12 text-right text-xs text-[#4b465c]">
              {rating.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSystem;