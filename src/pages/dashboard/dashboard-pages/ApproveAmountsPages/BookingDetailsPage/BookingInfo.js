import React, { useContext } from "react";
import { NumericFormat } from "react-number-format";
import icon from "../../../../../assets/booking/id.svg";
import { CurrencyContext } from "../../../../../utility/CurrencyContext";

const BookingInfo = ({ booking }) => {
  const { selectedCurrency, exchangeRates } = useContext(CurrencyContext);

  if (!booking) {
    return null; // or a loader or placeholder
  }

  const {
    adults = 0,
    child = 0,
    total_price = 0,
    start_date,
    end_date,
    special_request = "",
  } = booking;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const convertedCost = exchangeRates[selectedCurrency]
    ? (total_price / exchangeRates["PKR"]) * exchangeRates[selectedCurrency]
    : total_price;

  return (
    <div className="p-4 text-[#484848] bg-white border border-gray-200 shadow-sm rounded-lg">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4 mb-4">
        <div>
          <h3 className="text-sm font-normal">Adults & Children</h3>
          <p className="text-md font-semibold">
            {adults} - {child}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-normal">Total Cost</h3>
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
        <div>
          <h3 className="text-sm font-normal">Start Date & End Date</h3>
          <p className="text-md font-semibold">
            {formatDate(start_date)} <span className="text-[#00936C]">to</span>{" "}
            {formatDate(end_date)}
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-normal text-gray-400">Special Request</h3>
        <p className="text-md font-semibold">{special_request}</p>
      </div>
    </div>
  );
};

export default BookingInfo;
