import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFileImage, FaFilePdf, FaFileWord } from "react-icons/fa";
import dlt from "../../../../../../assets/booking/delete.svg";
import { buildAdminBookingSubflowPath } from "../../../bookingRouteUtils";

const getFileIcon = (title = "") => {
  const extension = title.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return <FaFilePdf className="text-red-500" />;
    case "doc":
    case "docx":
      return <FaFileWord className="text-blue-500" />;
    default:
      return <FaFileImage className="text-green-500" />;
  }
};

const getDocumentContextLabel = (document = {}) =>
  [document.ownerLabel, document.groupLabel, document.travelerName]
    .filter(Boolean)
    .join(" • ");

const AirlineDetails = ({ booking, onDelete, canManage = true }) => {
  const navigate = useNavigate();
  const airlineCards = Array.isArray(booking?.airline_cards) ? booking.airline_cards : [];
  const airlineDocuments = booking?.documents_by_category?.airline || [];

  const handleEdit = () => {
    navigate(buildAdminBookingSubflowPath(booking?.booking_number, "airline-tickets"), {
      state: { isEditing: true },
    });
  };

  return (
    <div className="space-y-2 pb-2">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium text-gray-500">Shared airline tickets</h2>
        {canManage ? (
          <button
            onClick={handleEdit}
            className="text-white text-xs bg-[#00936C] hover:bg-[#007B54] rounded px-3 py-1.5"
          >
            Edit/Update
          </button>
        ) : null}
      </div>

      <div className="bg-gray-50 rounded space-y-4 p-3">
        {airlineCards.length > 0 ? (
          airlineCards.map((card) => (
            <div key={card.id} className="p-4 bg-white border border-gray-200 rounded shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">{card.label}</p>
                  <h3 className="text-base font-semibold text-gray-800">
                    {(card.confirmed?.flightFrom || card.packageDefault?.flightFrom || "-") +
                      " -> " +
                      (card.confirmed?.flightTo || card.packageDefault?.flightTo || "-")}
                  </h3>
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                  {card.confirmed ? "Operator confirmed" : "Package default"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
                <div>
                  <p><strong>Airline:</strong> {card.packageDefault?.airlineName || "N/A"}</p>
                  <p><strong>Cabin:</strong> {card.packageDefault?.ticketType || "N/A"}</p>
                </div>
                <div>
                  <p>
                    <strong>Flight Date:</strong>{" "}
                    {card.confirmed?.flightDate
                      ? new Date(card.confirmed.flightDate).toLocaleString()
                      : "Not shared"}
                  </p>
                  <p><strong>Flight Time:</strong> {card.confirmed?.flightTime || "Not shared"}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No airline details available.</p>
        )}

        {airlineDocuments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {airlineDocuments.map((document) => (
              <div
                key={document.id}
                className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded shadow-sm"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  {getFileIcon(document.title)}
                  <a
                    href={document.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm text-gray-700 underline-offset-2 hover:underline"
                  >
                    <span className="block truncate">{document.title}</span>
                    {getDocumentContextLabel(document) ? (
                      <span className="block text-xs text-gray-500">
                        {getDocumentContextLabel(document)}
                      </span>
                    ) : null}
                  </a>
                </div>
                {canManage && onDelete ? (
                  <button
                    onClick={() => onDelete(document.raw?.document_id || document.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <img src={dlt} alt="delete" />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AirlineDetails;
