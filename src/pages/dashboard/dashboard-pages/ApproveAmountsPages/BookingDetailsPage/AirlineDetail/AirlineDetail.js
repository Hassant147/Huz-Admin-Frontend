import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaFileWord, FaFileImage } from "react-icons/fa";
import dlt from "../../../../../../assets/booking/delete.svg";
import toast from "react-hot-toast";

const getFileIcon = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();
  switch (extension) {
    case "pdf":
      return <FaFilePdf className="text-red-500" />;
    case "doc":
    case "docx":
      return <FaFileWord className="text-blue-500" />;
    case "png":
    case "jpg":
    case "jpeg":
      return <FaFileImage className="text-green-500" />;
    default:
      return <FaFileImage className="text-gray-500" />;
  }
};

const AirlineDetails = ({ booking, onDelete }) => {
  const [airlineDocuments, setAirlineDocuments] = useState([]);
  const { REACT_APP_API_BASE_URL } = process.env;
  const navigate = useNavigate();

  useEffect(() => {
    if (booking) {
      const airlineDocuments = booking.booking_documents.filter(
        (doc) => doc.document_for === "airline"
      );
      setAirlineDocuments(airlineDocuments);
    }
  }, [booking]);

  const openDocument = (documentLink) => {
    window.open(`${REACT_APP_API_BASE_URL}${documentLink}`, "_blank");
  };

  const handleEdit = () => {
    navigate("/package/airline-tickets", { state: { isEditing: true } });
  };

  return (
    <div className="space-y-2 pb-2">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium text-gray-500">
          Shared Airline Tickets Detail
        </h2>
      </div>
      <div className="bg-gray-50 rounded space-y-4">
        {booking.booking_airline_details.map((detail, index) => (
          <div
            key={index}
            className="p-4 bg-white border border-gray-200 rounded shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Flight Date:</strong>{" "}
                  {new Date(detail.flight_date).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Flight From:</strong> {detail.flight_from}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Flight Time:</strong> {detail.flight_time}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Flight To:</strong> {detail.flight_to}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {airlineDocuments.length > 0 ? (
            airlineDocuments.map((doc) => (
              <div
                key={doc.document_id}
                className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  {getFileIcon(doc.document_link)}
                  <p
                    className="text-sm text-gray-700 cursor-pointer"
                    onClick={() => openDocument(doc.document_link)}
                  >
                    {doc.document_link.split("/").pop()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className=" rounded-lg w-full max-w-md items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <p className="mt-2 text-sm text-center text-[#121212] font-poppins">
                  No Documents uploaded yet
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirlineDetails;
