import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import PackageDetails from "./PackageDetails";
import BookingInfo from "./BookingInfo";
import Action from "./Action/Action";
import TransactionDetails from "./TransactionDetails"; // Import the new TransactionDetails component
import CompanyDetail from "./CompanyDetail";
import BackButton from "../../../../../components/BackButton";

const BookingDetailsPage = () => {
  const location = useLocation();
  const { booking } = location.state; // Extract the booking data from the location state

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-[90%] mx-auto ">
        <BackButton />
        <div className="flex lg:flex-row flex-col lg:h-full mb-10 py-7">
          <div className="lg:w-[25%] space-y-6">
            <Sidebar booking={booking} />
          </div>
          <div className="lg:w-2/3 lg:px-4 space-y-6 mt-6 lg:mt-0 lg:space-y-4 flex-grow">
            <PackageDetails booking={booking} />
            <BookingInfo booking={booking} />
            <CompanyDetail booking={booking} />
            <TransactionDetails booking={booking} />
            <Action booking={booking} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
