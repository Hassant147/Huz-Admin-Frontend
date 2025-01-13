import React, { useState } from "react";
import Loader from "../../../components/loader";
import errorIcon from "../../../assets/error.svg";

const ReviewComponent = ({ reviews, apiError }) => {
  const renderStars = (rating) => {
    const totalStars = rating;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    const starsArray = [];

    for (let i = 0; i < fullStars; i++) {
      starsArray.push(
        <span key={`full_${i}`} className="text-[#00936C]">
          ★
        </span>
      );
    }
    if (halfStar > 0) {
      starsArray.push(
        <span key="half" className="text-[#00936C]">
          ★
        </span>
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      starsArray.push(
        <span key={`empty_${i}`} className="text-[#9790ae]">
          ★
        </span>
      );
    }

    return starsArray;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate} ${formattedTime.toLowerCase()}`;
  };

  return (
    <div className="">
      <h2 className="pb-3 md-12 font-medium text-lg text-[#4B465C] opacity-80">
        Customer Reviews
      </h2>
      {reviews && Array.isArray(reviews) && reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-custom-box mb-2">
            <div className="md:flex items-center justify-between">
              <div className="flex items-center">
                <img
                  className="w-12 h-12 rounded-full mr-4"
                  src={`${process.env.REACT_APP_API_BASE_URL}/media/${review.user_photo}`}
                  alt={`${review.user_fullName}`}
                />

                <div>
                  <p className="text-[#4B465C] text-sm opacity-80">
                    {review.user_fullName}
                  </p>
                  <p className="text-[#4B465C] text-sm opacity-80">
                    {review.user_address_detail.country}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="text-lg">
                  <span className="text-gray-600">
                    {review.partner_total_stars}
                  </span>
                  {renderStars(review.partner_total_stars)}
                </div>
                <div className="text-sm text-[#4b465c]">
                  {formatDate(review.rating_time)}
                </div>
              </div>
            </div>
            <p className="italic text-[#4B465C] text-lg opacity-80 mt-2">
              "{review.partner_comment}"
            </p>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <img src={errorIcon} alt="Error icon" className="w-16 h-16 my-4" />
          <p className="text-[#4B465C] text-lg opacity-80">
            There are no reviews available for this package right now.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewComponent;
