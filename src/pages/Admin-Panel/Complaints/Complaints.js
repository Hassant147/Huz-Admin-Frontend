import React, { useEffect, useState, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  getOverPartnerComplaints,
  getPartnerAllComplaints,
  updatePartnerAllComplaintsStatus,
} from "../../../utility/Api";
import AdminPanelLayout from "../../../components/layout/AdminPanelLayout";
import Loader from "../../../components/loader";
import bannerimg from "../../../assets/bookingbg.svg";
import openIcon from "../../../assets/complaints/open.png";
import inprogressIcon from "../../../assets/complaints/inprogress.png";
import solvedIcon from "../../../assets/complaints/solved.png";
import closeIcon from "../../../assets/complaints/complete.png";
import arrow from "../../../assets/arrow.svg";
import errorIcon from "../../../assets/error.svg";

const Complaints = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [status, setStatus] = useState("Open");
  const [toggleFetchData, setToggleFetchData] = useState(false);
  const [complaintCounts, setComplaintCounts] = useState({
    Open: 0,
    InProgress: 0,
    Solved: 0,
    Close: 0,
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const icons = { Open: openIcon, InProgress: inprogressIcon, Solved: solvedIcon, Close: closeIcon };

  const handleStatusClick = (newStatus) => {
    setIsLoading(true);
    setStatus(newStatus);
    setToggleFetchData((prev) => !prev);
  };

  const fetchData = useCallback(async (fetchFunction, updateState) => {
    const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
    if (!profile) {
      setApiError("Profile is missing");
      return;
    }
    try {
      const result = await fetchFunction(profile.partner_session_token);
      updateState(result);
    } catch (error) {
      setApiError("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(getOverPartnerComplaints, (result) => {
      if (result.error) {
        setApiError(result.error);
      } else {
        setComplaintCounts(result);
      }
    });
  }, [fetchData]);

  useEffect(() => {
    fetchData((token) => getPartnerAllComplaints(token, status), (result) => {
      if (result.error) {
        setApiError(result.error);
      } else {
        setComplaints(result.results);
      }
    });
  }, [status, toggleFetchData, fetchData]);

  const handleTakeAction = async () => {
    const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
    if (!profile) {
      setApiError("Profile is missing");
      return;
    }
    if (!selectedComplaint) {
      setApiError("No complaint selected");
      return;
    }

    const statusMap = { Open: "InProgress", InProgress: "Solved", Solved: "Close" };
    const updateStatus = statusMap[selectedComplaint.complaint_status];

    setIsLoading(true);

    try {
      const result = await updatePartnerAllComplaintsStatus(
        profile.partner_session_token,
        selectedComplaint.complaint_id,
        updateStatus
      );
      if (result.error) {
        setApiError(result.error);
      } else {
        setSelectedComplaint((prev) => ({ ...prev, complaint_status: updateStatus }));
        setComplaints((prev) => prev.filter((comp) => comp.complaint_id !== selectedComplaint.complaint_id));
        setComplaintCounts((prev) => ({
          ...prev,
          [selectedComplaint.complaint_status]: prev[selectedComplaint.complaint_status] - 1,
          [updateStatus]: prev[updateStatus] + 1,
        }));
        setSelectedComplaint(null);
        toast.success("Your complaint is in the next process");
      }
    } catch (error) {
      setApiError(error.message);
      toast.error("Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplaintClick = (complaint) => setSelectedComplaint(complaint);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase()}`;
  };

  const total = Object.values(complaintCounts).reduce((a, b) => a + b, 0);

  return (
    <AdminPanelLayout useContainer={false} mainClassName="py-0">
      <Toaster className="top-right" reverseOrder={false} />
      <div className="min-h-screen text-[#4b465c]">
        <div className="bg-[#bcdfd7]" style={{ backgroundImage: `url(${bannerimg})`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
          <div className="h-[100px] w-[90%] mx-auto flex items-center">
            <div className="flex items-center gap-2">
              <h1 className="font-medium text-lg text-[#4B465C] opacity-80">Total Complaints</h1>
              <p className="text-[#4B465C] font-bold text-[20px] opacity-50">{total}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap w-[90%] -mt-6 mx-auto gap-4 items-center h-auto md:h-auto">
          {["Open", "InProgress", "Solved", "Close"].map((type) => (
            <div
              key={type}
              className="w-full md:w-full lg:w-[23%] flex justify-between items-center cursor-pointer bg-white p-6 shadow-custom-box rounded-md"
              onClick={() => handleStatusClick(type)}
            >
              <div>
                <p className="text-[#00936c] text-lg">{complaintCounts[type]}</p>
                <p className="text-sm text-[#4b465c]">{type.replace(/([A-Z])/g, " $1")}</p>
              </div>
              <img src={icons[type]} alt={`${type} icon`} className="h-12 w-12" />
            </div>
          ))}
        </div>
        <div className="md:flex w-[90%] md:space-x-4 mt-3 mx-auto rounded-lg mb-8">
          <div className="w-full md:w-1/3 bg-white shadow-custom-box rounded-lg">
            <h1 className="p-6 text-[#4B465C] font-medium text-sm">Complaint details</h1>
            {isLoading ? (
              <div className="h-[400px] flex justify-center items-center">
                <Loader />
              </div>
            ) : (
              <div className="h-[400px] overflow-y-auto">
                {complaints.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <img src={errorIcon} alt="Error icon" className="w-16 h-16 my-4" />
                    <p className="text-[#4B465C] text-lg opacity-80">There are no complaints</p>
                  </div>
                ) : (
                  complaints.map((complaint) => (
                    <div
                      key={complaint.complaint_id}
                      className="cursor-pointer bg-[#f6f6f6] px-6 mb-1 flex justify-between hover:bg-[#cce9e2] items-center"
                      onClick={() => handleComplaintClick(complaint)}
                    >
                      <div className="space-y-1.5">
                        <h2 className="text-sm font-semibold text-[#00936C]">{complaint.user_fullName}</h2>
                        <p className="text-[#4B465C] font-medium text-xs opacity-80">{complaint.complaint_title}</p>
                        <p className="text-[#4B465C] font-normal text-xs opacity-80">{formatDate(complaint.complaint_time)}</p>
                      </div>
                      <img src={arrow} alt="arrow" className="py-8" />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="w-full md:w-[67%] mt-6 md:mt-0">
            {selectedComplaint ? (
              <div className="space-y-4">
                <div className="bg-white shadow-custom-box rounded-lg">
                  <div className="flex justify-end p-2">
                    <p
                      className={`text-sm bg-gray-50 rounded-md p-2 px-4 ${selectedComplaint.complaint_status === "Open"
                          ? "text-red-500 bg-red-100"
                          : selectedComplaint.complaint_status === "InProgress"
                            ? "text-[#FF9F43] bg-[#FF9F4329]"
                            : selectedComplaint.complaint_status === "Solved"
                              ? "text-[#00936C] bg-[#00936C29]"
                              : "bg-[#A8AAAE29] text-[#A8AAAE]"
                        }`}
                    >
                      {selectedComplaint.complaint_status}
                    </p>
                  </div>
                  <div className="p-6 py-2 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <img
                          className="w-12 h-12 rounded-full"
                          src={
                            selectedComplaint.user_photo
                              ? `${process.env.REACT_APP_API_BASE_URL}/media/${selectedComplaint.user_photo}`
                              : errorIcon
                          }
                          alt={`${selectedComplaint.user_fullName || "User"}`}
                        />
                        <div>
                          <p className="text-sm">{selectedComplaint.user_fullName || "Name is missing"}</p>
                          <p className="text-xs">
                            {selectedComplaint.user_address_detail?.city || "City is missing"},
                            {selectedComplaint.user_address_detail?.country || "Country is missing"}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-[#4b465c]">
                        {selectedComplaint.complaint_time
                          ? formatDate(selectedComplaint.complaint_time)
                          : "Date is missing"}
                      </p>
                    </div>
                    <p className="text-sm font-bold">
                      {selectedComplaint.complaint_title || "Title is missing"}
                    </p>
                    <p className="text-sm">{selectedComplaint.complaint_message || "Message is missing"}</p>
                    {selectedComplaint.audio_message && (
                      <div className="flex justify-center">
                        <audio controls className="w-full md:w-[75%] bg-white p-0 outline-none">
                          <source
                            src={`${process.env.REACT_APP_API_BASE_URL}${selectedComplaint.audio_message}`}
                            type="audio/ogg"
                          />
                          <source
                            src={`${process.env.REACT_APP_API_BASE_URL}${selectedComplaint.audio_message}`}
                            type="audio/mpeg"
                          />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleTakeAction}
                  disabled={selectedComplaint.complaint_status === "Close"}
                  className={`w-full text-center bg-[#00936c] text-white p-2 rounded-md ${selectedComplaint.complaint_status === "Close" && "cursor-not-allowed"
                    }`}
                >
                  {selectedComplaint.complaint_status === "Open"
                    ? "Proceed to In-Progress"
                    : selectedComplaint.complaint_status === "InProgress"
                      ? "Proceed to Solved"
                      : selectedComplaint.complaint_status === "Solved"
                        ? "Proceed to Close"
                        : "Closed"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full">
                <p className="text-[#4B465C] text-lg opacity-80">Your complaint is in Process</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminPanelLayout>
  );
};

export default Complaints;
