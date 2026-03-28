import React from "react";
import { FaFileImage, FaFilePdf, FaFileWord } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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

const VisaDetails = ({ booking, onDelete, canManage = true }) => {
  const navigate = useNavigate();
  const documents = booking?.documents_by_category?.evisa || [];

  const handleAddMore = () => {
    navigate(buildAdminBookingSubflowPath(booking?.booking_number, "upload-evisa"), {
      state: { isEditing: true },
    });
  };

  return (
    <div className="space-y-2 py-2">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium text-gray-500">Shared eVisa details</h2>
        {canManage ? (
          <button
            onClick={handleAddMore}
            className="text-white text-xs bg-[#00936C] hover:bg-[#007B54] rounded px-3 py-1.5"
          >
            Add more
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2 bg-gray-50 rounded">
        {documents.length > 0 ? (
          documents.map((document) => (
            <div
              key={document.id}
              className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded shadow-sm"
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
          ))
        ) : (
          <p className="col-span-full p-4 text-sm text-gray-600">
            No eVisa documents have been uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default VisaDetails;
