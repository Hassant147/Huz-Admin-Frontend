import React from "react";
import view from "../../../../../assets/view.svg";
import { useNavigate } from "react-router-dom";

const PackageDetails = ({ booking }) => {
  const navigate = useNavigate();

  if (!booking) {
    return null; // or a loader or placeholder
  }

  const {
    partnerSessionToken,
    huzToken,
    package_name,
    package_cost,
    mecca_nights,
    madinah_nights,
    is_visa_included,
    is_airport_reception_included,
    is_insurance_included,
    is_breakfast_included,
    is_lunch_included,
    is_dinner_included,
  } = booking;
  const handleCardClick = (partnerSessionToken, huzToken) => {
    navigate(
      `/packagedetails?partnerSessionToken=${partnerSessionToken}&huzToken=${huzToken}`
    );
  };
  return (
    <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-col lg:flex-row items-start lg:items-center justify-between">
      <div className="flex-1">
        <h2 className="font-medium text-gray-600">
          {package_name} (PKR {package_cost})
        </h2>
        <div className="text-gray-500 text-sm mt-1 flex flex-wrap">
          <span className="mr-2">Mecca Nights {mecca_nights}</span> -
          <span className="ml-2 mr-2">Madinah Nights {madinah_nights}</span> -
          {is_visa_included && <span className="ml-2 mr-2">Visa</span>} -
          {is_insurance_included && (
            <span className="ml-2 mr-2">Insurance</span>
          )}{" "}
          -
          {is_airport_reception_included && (
            <span className="ml-2 mr-2">Airport Reception</span>
          )}{" "}
          -
          {is_breakfast_included && (
            <span className="ml-2 mr-2">Breakfast</span>
          )}{" "}
          -{is_lunch_included && <span className="ml-2 mr-2">Lunch</span>} -
          {is_dinner_included && <span className="ml-2 mr-2">Dinner</span>}
        </div>
      </div>
      <button
        className="border flex items-center justify-center font-normal border-[#00936C] text-[#00936C] w-[62px] bg-green-100 py-[4px] rounded-md text-[13px] mt-4 lg:mt-0"
        onClick={() =>
          handleCardClick(booking.partner_session_token, booking.huz_token)
        }
      >
        View
      </button>
    </div>
  );
};

export default PackageDetails;
