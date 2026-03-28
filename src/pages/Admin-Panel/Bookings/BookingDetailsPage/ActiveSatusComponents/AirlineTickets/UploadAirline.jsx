import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import {
  deleteBookingDocument,
  PostAirlineDetails,
  updateAirlineDetails,
  updateBookingDocumentStatus,
} from "../../../../../../utility/Api";

const getDocumentContextLabel = (document = {}) =>
  [document.ownerLabel, document.groupLabel, document.travelerName]
    .filter(Boolean)
    .join(" • ");

const buildInitialSegments = (booking) => {
  const cards = Array.isArray(booking?.airline_cards) ? booking.airline_cards : [];
  if (cards.length > 0) {
    return cards.map((card) => ({
      id: card.confirmed?.id || "",
      direction: card.direction,
      label: card.label,
      airlineName: card.packageDefault?.airlineName || "",
      ticketType: card.packageDefault?.ticketType || "",
      flightDate: card.confirmed?.flightDate
        ? card.confirmed.flightDate.split("T")[0]
        : "",
      flightTime: card.confirmed?.flightTime || "",
      flightFrom: card.confirmed?.flightFrom || card.packageDefault?.flightFrom || "",
      flightTo: card.confirmed?.flightTo || card.packageDefault?.flightTo || "",
    }));
  }

  return [
    {
      id: "",
      direction: "outbound",
      label: "Outbound flight",
      airlineName: "",
      ticketType: "",
      flightDate: "",
      flightTime: "",
      flightFrom: "",
      flightTo: "",
    },
  ];
};

const UploadAirline = ({ booking }) => {
  const [segments, setSegments] = useState(() => buildInitialSegments(booking));
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const existingDocuments = useMemo(
    () => booking?.documents_by_category?.airline || [],
    [booking?.documents_by_category?.airline]
  );

  const updateSegmentField = (index, field, value) => {
    setSegments((currentSegments) =>
      currentSegments.map((segment, segmentIndex) =>
        segmentIndex === index
          ? {
              ...segment,
              [field]: value,
            }
          : segment
      )
    );
  };

  const handleFileSelection = (event) => {
    setSelectedFiles(Array.from(event.target.files || []));
  };

  const handleDeleteExistingDocument = async (documentId) => {
    try {
      await deleteBookingDocument({
        session_token: booking.user_session_token,
        document_id: documentId,
        booking_number: booking.booking_number,
        partner_session_token: booking.partner_session_token,
      });
      toast.success("Airline ticket deleted.");
      navigate(0);
    } catch (error) {
      console.error("Failed to delete airline ticket:", error);
      toast.error("Failed to delete airline ticket.");
    }
  };

  const handleSubmit = async () => {
    const validSegments = segments.filter(
      (segment) =>
        segment.flightDate && segment.flightTime && segment.flightFrom && segment.flightTo
    );

    if (validSegments.length === 0) {
      toast.error("Add at least one confirmed airline segment.");
      return;
    }

    setIsLoading(true);
    try {
      for (const segment of validSegments) {
        const payload = {
          partner_session_token: booking.partner_session_token,
          booking_number: booking.booking_number,
          flight_direction: segment.direction,
          flight_date: `${segment.flightDate}T${segment.flightTime || "00:00"}:00Z`,
          flight_time: segment.flightTime,
          flight_from: segment.flightFrom,
          flight_to: segment.flightTo,
          ...(segment.id ? { booking_airline_id: segment.id } : {}),
        };

        if (segment.id) {
          await updateAirlineDetails(payload);
        } else {
          await PostAirlineDetails(payload);
        }
      }

      for (const file of selectedFiles) {
        await updateBookingDocumentStatus(
          booking.partner_session_token,
          booking.booking_number,
          "airline",
          file,
          booking.user_session_token,
          {
            documentCategory: "airline",
          }
        );
      }

      toast.success("Airline details saved successfully.");
      navigate(-1);
    } catch (error) {
      console.error("Failed to update airline details:", error);
      toast.error("Failed to update airline details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start mt-5 md:mt-0">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="space-y-6 w-full">
        {segments.map((segment, index) => (
          <div key={`${segment.direction}-${index}`} className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-gray-700 text-lg font-medium">{segment.label}</h1>
                <p className="text-sm text-gray-500">
                  Package default: {[segment.airlineName, segment.ticketType].filter(Boolean).join(" • ") || "No package flight metadata"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div>
                <label className="text-sm text-gray-500">Flight date</label>
                <input
                  type="date"
                  value={segment.flightDate}
                  onChange={(event) =>
                    updateSegmentField(index, "flightDate", event.target.value)
                  }
                  className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Flight time</label>
                <input
                  type="time"
                  value={segment.flightTime}
                  onChange={(event) =>
                    updateSegmentField(index, "flightTime", event.target.value)
                  }
                  className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Flight from</label>
                <input
                  type="text"
                  value={segment.flightFrom}
                  onChange={(event) =>
                    updateSegmentField(index, "flightFrom", event.target.value)
                  }
                  className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Flight to</label>
                <input
                  type="text"
                  value={segment.flightTo}
                  onChange={(event) =>
                    updateSegmentField(index, "flightTo", event.target.value)
                  }
                  className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-gray-700 text-lg font-medium">Airline ticket files</h2>
            <p className="text-sm text-gray-500">
              Upload PDF or image tickets for the traveler-facing airline documents.
            </p>
          </div>

          <input
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            onChange={handleFileSelection}
            className="block w-full text-sm text-gray-700"
          />

          {selectedFiles.length > 0 ? (
            <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
              {selectedFiles.map((file) => (
                <p key={file.name}>{file.name}</p>
              ))}
            </div>
          ) : null}

          {existingDocuments.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Existing airline documents</p>
              {existingDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-700"
                >
                  <a
                    href={document.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate underline-offset-2 hover:underline"
                  >
                    <span className="block truncate">{document.title}</span>
                    {getDocumentContextLabel(document) ? (
                      <span className="block text-xs text-gray-500">
                        {getDocumentContextLabel(document)}
                      </span>
                    ) : null}
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteExistingDocument(document.raw?.document_id || document.id)
                    }
                    className="rounded-md bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 flex h-[50px] w-full items-center justify-center rounded-md bg-[#00936C] px-4 py-2 text-sm font-medium text-white hover:bg-[#00936ce0] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? <ClipLoader size={20} color="#fff" /> : "Share with Customer"}
        </button>
      </div>
    </div>
  );
};

export default UploadAirline;
