import React, { useContext, useState } from "react";
import CustomLoader from "../../../../components/loader";
import AdminPanelLayout from "../../../../components/layout/AdminPanelLayout";
import { BookingContext } from "../../../../context/BookingContext";
import Pending from "./Pending";
import Objection from "./Objection";
import Active from "./Active";
import ViewOnly from "./ViewOnly";
import Completed from "./Completed";
import History from "./History";
import Sidebar from "./components/Sidebar";
import PackageDetails from "./components/PackageDetails";
import BookingInfo from "./components/BookingInfo";
import Error from "../components/Error";
import ReviewAndRating from "./components/ReviewAndRating";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  getBookingWorkflowScreen,
  normalizeIssueStatus,
} from "../bookingWorkflowUtils";
import ReportedTravelers from "./components/ReportedTravelers";
import useAdminBookingLoader from "./useAdminBookingLoader";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const BookingDetailsContent = ({ booking, loading, error }) => {
  const { refreshBookingDetails } = useContext(BookingContext);
  const [expandedObjections, setExpandedObjections] = useState({});
  const [mainObjectionsExpanded, setMainObjectionsExpanded] = useState(false);

  const toggleObjection = (objectionId) => {
    setExpandedObjections((prev) => ({
      ...prev,
      [objectionId]: !prev[objectionId],
    }));
  };

  const toggleMainObjections = () => {
    setMainObjectionsExpanded((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CustomLoader />
      </div>
    );
  }

  if (error) {
    return <Error />;
  }

  const renderComponent = () => {
    switch (getBookingWorkflowScreen(booking)) {
      case "VIEW_ONLY":
        return <ViewOnly booking={booking} />;
      case "READY":
        return <Pending booking={booking} />;
      case "ISSUE":
        return <Objection booking={booking} />;
      case "FULFILLMENT":
        return (
          <Active
            booking={booking}
            fetchBookingDetails={refreshBookingDetails}
          />
        );
      case "READY_FOR_TRAVEL":
      case "COMPLETED":
        return <Completed booking={booking} />;
      case "HISTORY":
        return <History booking={booking} />;
      default:
        return <div>No booking status found</div>;
    }
  };

  const sortedObjections = [...(booking?.booking_objections || [])].sort(
    (a, b) => new Date(a.create_time) - new Date(b.create_time)
  );
  const issueStatus = normalizeIssueStatus(booking?.issue_status);

  return (
    <div className="flex lg:flex-row flex-col lg:h-full mb-10">
      <div className="lg:w-[25%] space-y-6">
        <Sidebar booking={booking} />
        {(booking?.booking_status === "READY_FOR_TRAVEL" ||
          booking?.booking_status === "COMPLETED") && (
          <ReviewAndRating booking={booking} />
        )}
      </div>
      <div className="lg:w-2/3 lg:px-4 py-4 lg:py-0 space-y-4 flex-grow">
        {issueStatus === "REPORTED" ? <ReportedTravelers booking={booking} /> : null}
        <PackageDetails booking={booking} />
        <BookingInfo booking={booking} />

        <div className="mb-4">
          <button
            onClick={toggleMainObjections}
            className="w-full text-left p-4 border rounded-lg bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300 flex justify-between items-center"
          >
            <span className="text-lg font-medium text-gray-800">
              Objections
            </span>
            {mainObjectionsExpanded ? (
              <FaChevronUp className="text-gray-800" />
            ) : (
              <FaChevronDown className="text-gray-800" />
            )}
          </button>
          {mainObjectionsExpanded && (
            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-600 mb-4">
                Objections Raised
              </h2>
              {sortedObjections.map((objection) => (
                <div key={objection.objection_id} className="mb-2">
                  <button
                    onClick={() => toggleObjection(objection.objection_id)}
                    className="w-full text-left p-2 border rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300 flex justify-between items-center"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(objection.create_time).toLocaleString()}
                    </span>
                    {expandedObjections[objection.objection_id] ? (
                      <FaChevronUp className="text-gray-700" />
                    ) : (
                      <FaChevronDown className="text-gray-700" />
                    )}
                  </button>
                  {expandedObjections[objection.objection_id] && (
                    <div className="p-4 mt-2 bg-gray-50 rounded-lg shadow-inner">
                      <p className="text-sm text-gray-800 font-medium mb-2">
                        <strong>Reason:</strong> {objection.remarks_or_reason}
                      </p>
                      <p className="text-sm text-gray-800 font-medium mb-2">
                        <strong>Client Remarks:</strong>{" "}
                        {objection.client_remarks
                          ? objection.client_remarks
                          : "N/A"}
                      </p>
                      {objection.required_document_for_objection && (
                        <div className="mt-3">
                          <strong className="text-sm text-gray-800 font-medium">
                            Required Document:
                          </strong>
                          <a
                            href={`${REACT_APP_API_BASE_URL}${objection.required_document_for_objection}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={`${REACT_APP_API_BASE_URL}${objection.required_document_for_objection}`}
                              alt="Required document"
                              className="mt-2 rounded-lg border border-gray-300"
                              style={{ width: "200px", height: "auto" }} // Adjust the width and height as needed
                            />
                          </a>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 mt-3">
                        <strong>Created At:</strong>{" "}
                        {new Date(objection.create_time).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {renderComponent()}
      </div>
    </div>
  );
};

const BookingDetails = () => {
  const { booking, loading, error } = useAdminBookingLoader({
    refreshIfResolved: true,
  });

  return (
    <AdminPanelLayout
      title="Booking Details"
      subtitle="Review booking information and process status actions."
      mainClassName="py-5 bg-[#F9F9F9]"
    >
      <div className="pt-2">
        <BookingDetailsContent
          booking={booking}
          loading={loading}
          error={!booking || Boolean(error)}
        />
      </div>
    </AdminPanelLayout>
  );
};

export default BookingDetails;
