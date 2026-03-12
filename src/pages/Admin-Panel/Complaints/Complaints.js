import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  getOverPartnerComplaints,
  getPartnerAllComplaints,
  updatePartnerAllComplaintsStatus,
} from "../../../utility/Api";
import AdminPanelLayout from "../../../components/layout/AdminPanelLayout";
import Loader from "../../../components/loader";
import Pagination from "../Bookings/components/Pagination";
import bannerimg from "../../../assets/bookingbg.svg";
import openIcon from "../../../assets/complaints/open.png";
import inprogressIcon from "../../../assets/complaints/inprogress.png";
import solvedIcon from "../../../assets/complaints/solved.png";
import closeIcon from "../../../assets/complaints/complete.png";
import arrow from "../../../assets/arrow.svg";
import errorIcon from "../../../assets/error.svg";

const PAGE_SIZE = 8;

const Complaints = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [apiError, setApiError] = useState("");
  const [status, setStatus] = useState("Open");
  const [complaintCounts, setComplaintCounts] = useState({
    Open: 0,
    InProgress: 0,
    Solved: 0,
    Close: 0,
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const icons = {
    Open: openIcon,
    InProgress: inprogressIcon,
    Solved: solvedIcon,
    Close: closeIcon,
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const getPartnerToken = () => {
    const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
    return profile?.partner_session_token || "";
  };

  const loadComplaintCounts = useCallback(async () => {
    const partnerSessionToken = getPartnerToken();
    if (!partnerSessionToken) {
      setApiError("Profile is missing");
      return;
    }

    try {
      const result = await getOverPartnerComplaints(partnerSessionToken);
      if (result?.error) {
        setApiError(result.error);
        return;
      }

      setComplaintCounts(result);
    } catch (error) {
      setApiError("Error fetching complaint summary");
    }
  }, []);

  const loadComplaints = useCallback(async () => {
    const partnerSessionToken = getPartnerToken();
    if (!partnerSessionToken) {
      setApiError("Profile is missing");
      setComplaints([]);
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      const result = await getPartnerAllComplaints(partnerSessionToken, {
        status,
        page: currentPage,
        pageSize: PAGE_SIZE,
        search: searchTerm,
        fromDate: dateFrom,
        toDate: dateTo,
      });

      setComplaints(result.results || []);
      setTotalCount(result.count || 0);
    } catch (error) {
      setApiError("Error fetching data");
      setComplaints([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, dateFrom, dateTo, searchTerm, status]);

  useEffect(() => {
    loadComplaintCounts();
  }, [loadComplaintCounts]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedSearch = searchInput.trim();
      if (normalizedSearch === searchTerm) {
        return;
      }

      setCurrentPage(1);
      setSearchTerm(normalizedSearch);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput, searchTerm]);

  useEffect(() => {
    setSelectedComplaint(null);
  }, [status, currentPage, searchTerm, dateFrom, dateTo]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleStatusClick = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handleTakeAction = async () => {
    const partnerSessionToken = getPartnerToken();
    if (!partnerSessionToken) {
      setApiError("Profile is missing");
      return;
    }
    if (!selectedComplaint) {
      setApiError("No complaint selected");
      return;
    }

    const statusMap = {
      Open: "InProgress",
      InProgress: "Solved",
      Solved: "Close",
    };
    const updateStatus = statusMap[selectedComplaint.complaint_status];

    if (!updateStatus) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePartnerAllComplaintsStatus(
        partnerSessionToken,
        selectedComplaint.complaint_id,
        updateStatus
      );

      if (result.error) {
        setApiError(result.error);
        toast.error("Failed");
        return;
      }

      setSelectedComplaint(null);
      await Promise.all([loadComplaintCounts(), loadComplaints()]);
      toast.success("Complaint moved to the next status");
    } catch (error) {
      setApiError(error.message || "Failed");
      toast.error("Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })} ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase()}`;
  };

  const total = useMemo(
    () => Object.values(complaintCounts).reduce((sum, value) => sum + value, 0),
    [complaintCounts]
  );

  return (
    <AdminPanelLayout useContainer={false} mainClassName="py-0">
      <Toaster className="top-right" reverseOrder={false} />
      <div className="min-h-screen text-[#4b465c]">
        <div
          className="bg-[#bcdfd7]"
          style={{
            backgroundImage: `url(${bannerimg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="h-[100px] w-[90%] mx-auto flex items-center">
            <div className="flex items-center gap-2">
              <h1 className="font-medium text-lg text-[#4B465C] opacity-80">
                Total Complaints
              </h1>
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
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-[#4B465C] font-medium text-sm">Complaint details</h1>
                <p className="text-xs text-[#4B465C] opacity-60">
                  Page {currentPage} of {totalPages}
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search ticket, booking, traveler..."
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(event) => {
                      setDateFrom(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(event) => {
                      setDateTo(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                    setDateFrom("");
                    setDateTo("");
                    setCurrentPage(1);
                  }}
                  className="text-sm font-medium text-[#00936C]"
                >
                  Clear filters
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="h-[400px] flex justify-center items-center">
                <Loader />
              </div>
            ) : (
              <>
                <div className="h-[400px] overflow-y-auto">
                  {complaints.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center h-full px-6">
                      <img src={errorIcon} alt="Error icon" className="w-16 h-16 my-4" />
                      <p className="text-[#4B465C] text-lg opacity-80">
                        {apiError || "There are no complaints"}
                      </p>
                    </div>
                  ) : (
                    complaints.map((complaint) => (
                      <div
                        key={complaint.complaint_id}
                        className="cursor-pointer bg-[#f6f6f6] px-6 mb-1 flex justify-between hover:bg-[#cce9e2] items-center"
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        <div className="space-y-1.5 py-4">
                          <h2 className="text-sm font-semibold text-[#00936C]">
                            {complaint.user_fullName}
                          </h2>
                          <p className="text-[#4B465C] font-medium text-xs opacity-80">
                            {complaint.complaint_title}
                          </p>
                          <p className="text-[#4B465C] font-normal text-xs opacity-80">
                            {formatDate(complaint.complaint_time)}
                          </p>
                        </div>
                        <img src={arrow} alt="arrow" className="py-8" />
                      </div>
                    ))
                  )}
                </div>
                {complaints.length > 0 ? (
                  <div className="border-t border-slate-100 p-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
          <div className="w-full md:w-[67%] mt-6 md:mt-0">
            {selectedComplaint ? (
              <div className="space-y-4">
                <div className="bg-white shadow-custom-box rounded-lg">
                  <div className="flex justify-end p-2">
                    <p
                      className={`text-sm bg-gray-50 rounded-md p-2 px-4 ${
                        selectedComplaint.complaint_status === "Open"
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
                          <p className="text-sm">
                            {selectedComplaint.user_fullName || "Name is missing"}
                          </p>
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
                    <p className="text-sm">
                      {selectedComplaint.complaint_message || "Message is missing"}
                    </p>
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
                  className={`w-full text-center bg-[#00936c] text-white p-2 rounded-md ${
                    selectedComplaint.complaint_status === "Close"
                      ? "cursor-not-allowed"
                      : ""
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
              <div className="flex flex-col items-center justify-center text-center h-full min-h-[420px] bg-white shadow-custom-box rounded-lg px-6">
                <p className="text-[#4B465C] text-lg opacity-80">
                  Select a complaint to review its details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminPanelLayout>
  );
};

export default Complaints;
