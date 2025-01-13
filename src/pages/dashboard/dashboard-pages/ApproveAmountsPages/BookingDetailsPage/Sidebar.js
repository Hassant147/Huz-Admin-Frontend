import React from "react";
import mail from "../../../../../assets/booking/mail.svg";
import location from "../../../../../assets/booking/location.svg";
import phone from "../../../../../assets/booking/phone.svg";
import user from "../../../../../assets/booking/user.svg";

const Sidebar = ({ booking }) => {
  if (!booking) {
    return <div>Loading...</div>;
  }

  const {
    partner_type_and_detail = {},
    partner_name,
    partner_email,
    phone_number,
    user_photo,
    address,
  } = booking;

  //   const { partner_name, contact_name, contact_number, company_logo } =
  //     partner_type_and_detail;

  const { REACT_APP_API_BASE_URL } = process.env;

  const getStatusColor = (status) => {
    switch (status) {
      case "Rejected":
        return "bg-[#FDECEA] text-[#F04438] font-semibold";
      case "Active":
        return "bg-[#c8eddb] text-[#019267] font-semibold";
      case "Pending":
        return "bg-[#fff0e1] text-[#FF9F43] font-semibold";
      case "Completed":
        return "bg-[#f1f1f2] text-[#A8AAAE] font-semibold";
      case "Close":
        return "bg-[#d6eee7] text-[#00936C] font-semibold";
      default:
        return "bg-gray-200 text-gray-800 font-semibold";
    }
  };
  return (
    <div className="pr-4 pb-4 pl-1 pt-1 bg-white shadow-md rounded-lg">
      <div
        className={`${getStatusColor(
          booking.booking_status
        )} w-24 px-4 py-1.5 font-extralight text-center text-sm rounded-md mb-4 mx-auto sm:mx-0`}
      >
        {booking.booking_status}
      </div>
      <div className="px-4 flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex justify-center items-center overflow-hidden">
          {booking &&
          booking.company_detail &&
          booking.company_detail.company_logo ? (
            <img
              src={`${REACT_APP_API_BASE_URL}${booking.company_detail.company_logo}`}
              alt="Company Logo"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-gray-500 text-sm">Logo not available</div>
          )}
        </div>

        <div className="flex flex-col mb-4 mt-4 gap-y-2 w-full">
          <h2 className="font-thin text-gray-500 text-sm flex items-center">
            Contact Details
          </h2>
          <h2 className="font-light text-gray-600 text-sm flex items-center">
            <img src={user} alt="User Icon" className="w-4 h-4 mr-2" />

            <span className="font-thin">
              {booking.company_detail.company_name
                ? booking.company_detail.company_name
                : "Company name is not available"}
            </span>
          </h2>
          <p className="font-light text-gray-600 text-sm flex items-center">
            <img src={phone} alt="Phone Icon" className="w-4 h-4 mr-2" />
            {booking.company_detail.contact_number
              ? booking.company_detail.contact_number
              : "contact number is not available"}{" "}
          </p>
          <h2 className="font-light text-gray-600 text-sm flex items-center">
            <img src={user} alt="User Icon" className="w-4 h-4 mr-2" />

            <span className="font-thin">
              {partner_name ? partner_name : "partner name is not available"}
            </span>
          </h2>
          <p className="font-light text-gray-600 text-sm flex items-center">
            <img src={mail} alt="Mail Icon" className="w-4 h-4 mr-2" />
            {partner_email ? partner_email : "Email is not available"}
          </p>
        </div>

        <div className="text-left w-full">
          <h2 className="font-thin text-gray-500 text-sm flex">
            Address Details
          </h2>
          <p className="font-light text-gray-600 text-sm flex mt-2">
            <img src={location} alt="Location Icon" className="w-4 h-4 mr-2" />
            {booking.partner_address_detail.street_address
              ? booking.partner_address_detail.street_address
              : "address is not available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
