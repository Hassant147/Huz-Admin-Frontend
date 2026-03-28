import React from "react";
import { useNavigate } from "react-router-dom";
import { buildAdminBookingSubflowPath } from "../../../bookingRouteUtils";

const MODE_LABELS = {
  none: "Nothing shared yet",
  ticket_only: "Ticket shared",
  details_only: "Details shared",
  details_and_ticket: "Details and ticket",
};

const getDocumentContextLabel = (document = {}) =>
  [document.ownerLabel, document.groupLabel, document.travelerName]
    .filter(Boolean)
    .join(" • ");

const TransportDetails = ({ booking, canManage = true }) => {
  const navigate = useNavigate();
  const bookingNumber = booking?.booking_number || "";
  const transport = booking?.transport_fulfillment_view || null;
  const packageTransport = booking?.package_transport_view || null;
  const packageHasTransport =
    Boolean(packageTransport?.transportName) || Boolean(packageTransport?.routeLabels?.length);

  const handleEdit = () => {
    navigate(buildAdminBookingSubflowPath(bookingNumber, "transport-arrangement"), {
      state: { isEditing: true },
    });
  };

  return (
    <div className="space-y-2 pb-2">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium text-gray-500">Shared transport details</h2>
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
        <div className="p-4 bg-white border border-gray-200 rounded shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Transport mode</p>
              <h3 className="text-base font-semibold text-gray-800">
                {transport?.hasDetailsContent && transport?.hasTicketContent
                  ? MODE_LABELS.details_and_ticket
                  : transport?.hasTicketContent
                  ? MODE_LABELS.ticket_only
                  : transport?.hasDetailsContent
                  ? MODE_LABELS.details_only
                  : packageHasTransport
                  ? "Pending share"
                  : "Not included"}
              </h3>
            </div>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
              {transport?.hasDetailsContent || transport?.hasTicketContent
                ? "Configured"
                : packageHasTransport
                ? "Awaiting operator share"
                : "Package default absent"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
              <p className="text-xs uppercase tracking-wide text-gray-400">Package default</p>
              <p className="mt-2"><strong>Transport:</strong> {packageTransport?.transportName || "N/A"}</p>
              <p><strong>Type:</strong> {packageTransport?.transportType || "N/A"}</p>
              <p><strong>Routes:</strong> {packageTransport?.routeLabels?.join(" • ") || "N/A"}</p>
            </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Booking confirmation</p>
              <p className="mt-2">
                <strong>Transport:</strong>{" "}
                {transport?.transportName ||
                  (transport?.hasTicketContent ? "Ticket file shared" : "Not shared")}
              </p>
              <p><strong>Type:</strong> {transport?.transportType || "Not shared"}</p>
              <p><strong>Routes:</strong> {transport?.routeLabels?.join(" • ") || transport?.routeSummary || "Not shared"}</p>
              <p><strong>Contact:</strong> {transport?.contactName || "Not shared"}</p>
              <p><strong>Phone:</strong> {transport?.contactPhone || "Not shared"}</p>
              <p><strong>Ticket reference:</strong> {transport?.ticketReference || "Not shared"}</p>
              <p><strong>Note:</strong> {transport?.note || "No traveler-facing note shared"}</p>
                </div>
          </div>

          {transport?.documents?.length > 0 ? (
            <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
              <p className="text-xs uppercase tracking-wide text-gray-400">Ticket documents</p>
              <div className="mt-2 space-y-2">
                {transport.documents.map((document) => (
                  <a
                    key={document.id}
                    href={document.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#00936C] underline-offset-2 hover:underline"
                  >
                    <span className="block">{document.title}</span>
                    {getDocumentContextLabel(document) ? (
                      <span className="block text-xs text-gray-500">
                        {getDocumentContextLabel(document)}
                      </span>
                    ) : null}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TransportDetails;
