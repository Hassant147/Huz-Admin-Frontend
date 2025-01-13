import React from 'react';
import filledStar from '../../../../../assets/booking/star.svg';
import nonFilledStar from '../../../../../assets/booking/star-1.svg';

const Star = ({ filled }) => (
  <img
    src={filled ? filledStar : nonFilledStar}
    alt={filled ? 'Filled Star' : 'Non-Filled Star'}
    className="w-6 h-6"
  />
);


const ReviewCard = ({ review }) => (
  <div className="border rounded-lg p-4 shadow-sm">
    <div className="mb-4">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} filled={i < review.partner_total_stars} />
        ))}
      </div>
    </div>
    <p className="text-gray-500 text-sm">{review.partner_comment}</p>
  </div>
);

const NoReview = () => (
  <div className="border rounded-lg p-10 flex flex-col items-center justify-center shadow-sm">
    <svg
      className="w-12 h-12 text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4l3 3m9-4a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p className="text-gray-600">No review yet</p>
  </div>
);

const ReviewAndRating = ({ booking }) => {
  const reviews = booking.booking_rating || [];

  return (
    <div className="w-full">
      <h2 className="text-lg font-medium text-gray-500 mb-2">Customer Review & Rating</h2>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))
      ) : (
        <NoReview />
      )}
    </div>
  );
};

export default ReviewAndRating;
