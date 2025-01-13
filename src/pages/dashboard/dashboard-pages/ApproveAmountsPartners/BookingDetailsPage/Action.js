import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { updatePartnerPaymentStatus } from "../../../../../utility/Super-Admin-Api"; // Import the new API function
import Loader from "../../../../../components/loader"; // Import your Loader component

const Action = ({ booking }) => {
  const [isSelect, setIsSelect] = useState("Accept");
  const [isLoading, setIsLoading] = useState(false); // State to track API call status
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleChange = (e) => {
    setIsSelect(e.target.value);
  };

  const handleSubmit = async () => {
    const { partner_session_token, booking_number } = booking;

    setIsLoading(true); // Set loading state to true

    if (isSelect === "Accept") {
      const response = await updatePartnerPaymentStatus(
        partner_session_token,
        booking_number
      );

      // Handle different response statuses
      if (response.status === 200) {
        toast.success("Booking status updated successfully!");
        navigate(-1); // Navigate back to the previous page
      } else if (response.status === 400) {
        toast.error("Bad Request: Missing or invalid input data.");
      } else if (response.status === 401) {
        toast.error("Unauthorized: Admin permissions required.");
      } else if (response.status === 404) {
        toast.error("Not Found: Booking or user detail not found.");
      } else if (response.status === 409) {
        toast.warning(
          "Conflict: The current account status does not allow this action."
        );
      } else {
        toast.error("Internal Server Error: Something went wrong.");
      }
    } else {
      toast.warning("Booking rejected. No changes made.");
      navigate(-1)
    }

    setIsLoading(false); // Set loading state to false after API call
  };

  return (
    <div className="space-y-4">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <div className="bg-white p-6 rounded-md text-[20px] text-gray-500 font-semibold space-y-4">
        <p>Your Action</p>
        <p className="text-[16px]">Which kind of option you want to choose?</p>
        <div className="flex items-center gap-20">
          <div className="flex items-center gap-2" onChange={handleChange}>
            <input
              type="radio"
              value="Accept"
              checked={isSelect === "Accept"}
              onChange={handleChange}
            />
            <label className="text-[13px]">Accept</label>
          </div>
          <div className="flex items-center gap-2" onChange={handleChange}>
            <input
              type="radio"
              value="Reject"
              checked={isSelect === "Reject"}
              onChange={handleChange}
            />
            <label className="text-[13px]">Reject</label>
          </div>
        </div>
      </div>
      <button
        className="w-full bg-[#00936c] text-white text-center p-3 rounded-md flex items-center justify-center"
        onClick={handleSubmit}
        disabled={isLoading} // Disable the button when loading
      >
        {isLoading ? <Loader /> : "Submit Your Decision"}{" "}
        {/* Show loader or button text */}
      </button>
    </div>
  );
};

export default Action;
