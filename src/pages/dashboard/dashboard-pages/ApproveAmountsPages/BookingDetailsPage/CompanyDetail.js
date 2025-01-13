import React from "react";
const CompanyDetail = ({ booking }) => {

  if (!booking) {
    return null; // or a loader or placeholder
  }

  return (
    <div className="p-4 text-[#484848] bg-white border border-gray-200 shadow-sm rounded-lg flex items-center justify-between">
      <div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold xl:text-[18px]">
              {booking?.company_detail?.company_name}
            </h2>

          </div>
        </div>
        <div className="text-sm mt-3 lg:mt-1 md:mr-2 lg:mr-0 space-y-2">
          <p className="">
            Contact Name:{" "}
            <span className="ml-1">
              {booking?.company_detail?.contact_name}
            </span>
          </p>{" "}
          <p className="space-x-4">
            {" "}
            Contact Number:
            <span className="ml-1">
              {booking?.company_detail?.contact_number}
            </span>
          </p>{" "}
          <p className="space-x-2">
            {" "}
            Total Experience:
            <span className="ml-1">
              {booking?.company_detail?.total_experience}
            </span>
          </p>{" "}
          <p className="space-x-2">
            {" "}
            Contact Address:{" "}
            <span className="ml-1">
              {booking?.company_detail?.company_address
                ? booking.company_detail.company_address
                : "address not available"}
            </span>
          </p>{" "}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
