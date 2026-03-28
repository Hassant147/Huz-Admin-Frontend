import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import {
  deleteBookingDocument,
  postTransportDetails,
  updateBookingDocumentStatus,
  updateTransportDetails,
} from "../../../../../../utility/Api";

const getDocumentContextLabel = (document = {}) =>
  [document.ownerLabel, document.groupLabel, document.travelerName]
    .filter(Boolean)
    .join(" • ");

const MODE_OPTIONS = [
  { value: "none", label: "Nothing shared yet" },
  { value: "ticket_only", label: "Ticket file or reference" },
  { value: "details_only", label: "Contact or service details" },
  { value: "details_and_ticket", label: "Details and ticket" },
];

const buildInitialFormState = (booking) => ({
  transportMode: booking?.transport_fulfillment_view?.mode || "none",
  transportName: booking?.transport_fulfillment_view?.transportName || "",
  transportType: booking?.transport_fulfillment_view?.transportType || "",
  routeSummary:
    booking?.transport_fulfillment_view?.routeSummary ||
    booking?.package_transport_view?.routeLabels?.join(", ") ||
    "",
  contactName: booking?.transport_fulfillment_view?.contactName || "",
  contactPhone: booking?.transport_fulfillment_view?.contactPhone || "",
  ticketReference: booking?.transport_fulfillment_view?.ticketReference || "",
  note: booking?.transport_fulfillment_view?.note || "",
});

const hasTransportDetails = (formData = {}) =>
  [
    formData.transportName,
    formData.transportType,
    formData.routeSummary,
    formData.contactName,
    formData.contactPhone,
  ].some((value) => String(value || "").trim());

const hasTransportTicket = (formData = {}, selectedFiles = [], existingDocuments = []) =>
  Boolean(String(formData.ticketReference || "").trim()) ||
  selectedFiles.length > 0 ||
  existingDocuments.length > 0;

const inferTransportMode = (formData = {}, selectedFiles = [], existingDocuments = []) => {
  const detailShare = hasTransportDetails(formData);
  const ticketShare = hasTransportTicket(formData, selectedFiles, existingDocuments);

  if (detailShare && ticketShare) {
    return "details_and_ticket";
  }
  if (ticketShare) {
    return "ticket_only";
  }
  if (detailShare) {
    return "details_only";
  }
  return "none";
};

const TransportArrangementForm = ({ isEditing, booking }) => {
  const [formData, setFormData] = useState(() => buildInitialFormState(booking));
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const existingDocuments = useMemo(
    () => booking?.documents_by_category?.transport || [],
    [booking?.documents_by_category?.transport]
  );

  const handleInputChange = (fieldName, value) => {
    setFormData((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }));
  };

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleDeleteExistingDocument = async (documentId) => {
    try {
      await deleteBookingDocument({
        session_token: booking.user_session_token,
        document_id: documentId,
        booking_number: booking.booking_number,
        partner_session_token: booking.partner_session_token,
      });
      toast.success("Transport document deleted.");
      navigate(0);
    } catch (error) {
      console.error("Failed to delete transport document:", error);
      toast.error("Failed to delete transport document.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const packageHasTransport = Boolean(
      booking?.package_transport_view?.transportName ||
        booking?.package_transport_view?.routeLabels?.length
    );
    const detailShare = hasTransportDetails(formData);
    const ticketShare = hasTransportTicket(formData, selectedFiles, existingDocuments);

    if (packageHasTransport && !detailShare && !ticketShare) {
      toast.error(
        "Share transport details or upload the ticket file. One of them is required when the booking includes transport."
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        partner_session_token: booking.partner_session_token,
        booking_number: booking.booking_number,
        detail_for: "Transport",
        transport_mode: inferTransportMode(formData, selectedFiles, existingDocuments),
        transport_name: formData.transportName,
        transport_type: formData.transportType,
        route_summary: formData.routeSummary,
        contact_name: formData.contactName,
        contact_phone: formData.contactPhone,
        ticket_reference: formData.ticketReference,
        note: formData.note,
      };

      if (isEditing) {
        await updateTransportDetails(payload);
      } else {
        await postTransportDetails(payload);
      }

      for (const file of selectedFiles) {
        await updateBookingDocumentStatus(
          booking.partner_session_token,
          booking.booking_number,
          "transport",
          file,
          booking.user_session_token,
          {
            documentCategory: "transport",
          }
        );
      }

      toast.success("Transport arrangement saved successfully.");
      navigate(-1);
    } catch (error) {
      console.error("Failed to submit transport arrangement:", error);
      toast.error("Failed to save transport arrangement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-md border bg-white p-6 space-y-4">
          <div>
            <h1 className="text-[#4B465C] text-lg font-semibold">Transport arrangement</h1>
            <p className="mt-1 text-sm text-gray-500">
              Share the transport the operator actually has: contact details, ticket files, or both.
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Sharing style</label>
            <select
              value={formData.transportMode}
              onChange={(event) =>
                handleInputChange("transportMode", event.target.value)
              }
              className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
            >
              {MODE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {formData.transportMode !== "none" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-gray-500">Provider / service name</label>
                <input
                  type="text"
                  value={formData.transportName}
                  onChange={(event) =>
                    handleInputChange("transportName", event.target.value)
                  }
                  className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Transport type</label>
                <input
                  type="text"
                  value={formData.transportType}
                  onChange={(event) =>
                    handleInputChange("transportType", event.target.value)
                  }
                  className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Route summary</label>
                <input
                  type="text"
                  value={formData.routeSummary}
                  onChange={(event) =>
                    handleInputChange("routeSummary", event.target.value)
                  }
                  className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Ticket reference</label>
                <input
                  type="text"
                  value={formData.ticketReference}
                  onChange={(event) =>
                    handleInputChange("ticketReference", event.target.value)
                  }
                  className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Contact name</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(event) =>
                    handleInputChange("contactName", event.target.value)
                  }
                  className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Contact phone</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(event) =>
                    handleInputChange("contactPhone", event.target.value)
                  }
                  className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
                />
              </div>
            </div>
          ) : null}

          <div>
            <label className="text-sm text-gray-500">Operator note</label>
            <textarea
              value={formData.note}
              onChange={(event) => handleInputChange("note", event.target.value)}
              className="mt-1 h-32 w-full rounded border border-gray-300 p-4 text-sm text-gray-700"
              placeholder="Optional note for the traveler."
            />
          </div>
        </div>

        <div className="rounded-md border bg-white p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-[#4B465C]">Transport ticket files</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload PDF or image tickets when the share is file-based. Contact fields can stay empty when the ticket itself is enough.
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
              <p className="text-sm font-medium text-gray-600">Existing transport documents</p>
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
          type="submit"
          disabled={loading}
          className="flex h-[50px] w-full items-center justify-center rounded-md bg-[#00936C] px-4 py-2 text-sm font-medium text-white hover:bg-[#00936ce0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <ClipLoader color="white" size={20} /> : "Share with Customer"}
        </button>
      </form>
    </div>
  );
};

export default TransportArrangementForm;
