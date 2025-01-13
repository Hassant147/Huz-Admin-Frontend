import React, { useContext } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import { CurrencyContext } from "../../../../../utility/CurrencyContext";

const PackageDetails = ({ booking }) => {
  const navigate = useNavigate();
  const { selectedCurrency, exchangeRates } = useContext(CurrencyContext);

  if (!booking) {
    return null; // or a loader or placeholder
  }

  const {
    package_name,
    huz_token,
    base_cost,
    mecca_nights,
    madinah_nights,
    is_visa_included,
    is_airport_reception_included,
    is_insurance_included,
    is_breakfast_included,
    is_lunch_included,
    is_dinner_included,
  } = booking;

  const convertedCost = exchangeRates[selectedCurrency]
    ? (base_cost / exchangeRates["PKR"]) * exchangeRates[selectedCurrency]
    : base_cost;

  return (
    <div className="p-4 text-[#484848] bg-white border border-gray-200 shadow-sm rounded-lg flex items-center justify-between">
      <div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold xl:text-[18px]">{package_name}</h2>
            <NumericFormat
              value={convertedCost}
              displayType={"text"}
              thousandSeparator
              prefix={`${selectedCurrency} `}
              decimalScale={2}
              fixedDecimalScale={true}
              className="font-semibold text-[16px]"
            />
          </div>
          {/* only for mobile */}
          <button className="md:hidden border px-2 flex items-center justify-center font-semibold border-[#00936C] text-[#00936C] w-[62px] bg-green-100 py-[4px] rounded-md text-[13px]">
            View
          </button>
        </div>
        <div className="text-sm mt-3 lg:mt-1 md:mr-2 lg:mr-0">
          <span className="mr-2">Mecca Nights {mecca_nights}</span> -
          <span className="mx-2">Madinah Nights {madinah_nights}</span> -
          <span className="mx-2">{is_visa_included && "Visa"}</span> -
          <span className="mx-2">{is_insurance_included && "Insurance"}</span> -
          <span className="mx-2">
            {is_airport_reception_included && "Airport Reception"}
          </span>{" "}
          -<span className="mx-2">{is_breakfast_included && "Breakfast"}</span>{" "}
          -<span className="mx-2">{is_lunch_included && "Lunch"}</span> -
          <span className="mx-2">{is_dinner_included && "Dinner"}</span>
        </div>
      </div>
      <button
        onClick={() =>
          navigate(`/detailpage/?packageId=${huz_token}`, {
            state: { huz_token },
          })
        }
        className="hidden md:flex border px-2 items-center justify-center font-semibold border-[#00936C] text-[#00936C] w-[62px] bg-green-100 py-[4px] rounded-md text-[13px]"
      >
        View
      </button>
    </div>
  );
};

export default PackageDetails;
