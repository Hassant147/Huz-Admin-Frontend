import React, { useState } from 'react';
import icon from '../../../../../assets/id.svg';
import DocumentsModal from './DocumentsModal';

const BookingInfo = ({ booking }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!booking) {
    return null; // or a loader or placeholder
  }

  const {
    adults = 0,
    child = 0,
    infants = 0,
    total_price = 0,
    start_date,
    end_date,
    special_request = '',
    booking_required_documents = [],
  } = booking;

  const requiredDocuments = booking_required_documents.filter(doc => doc.document_for === "Required_Documents");

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-lg">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
        <div className="w-full lg:w-auto">
          <div className="flex flex-wrap lg:space-x-20 space-y-4 lg:space-y-0">
            <div className="w-full lg:w-auto">
              <h3 className="text-xs font-normal text-gray-400">Adults, Child & Infants</h3>
              <p className="text-sm font-medium text-gray-600">{adults} - {child} - {infants}</p>
            </div>
            <div className="w-full lg:w-auto">
              <h3 className="text-xs font-normal text-gray-400">Total Cost</h3>
              <p className="text-sm font-medium text-gray-600">PKR {total_price}</p>
            </div>
            <div className="w-full lg:w-auto">
              <h3 className="text-xs font-normal text-gray-400">Start date & End date</h3>
              <p className="text-sm font-medium text-gray-600">
                {new Date(start_date).toLocaleDateString()} <span style={{ color: '#00936C' }}>to</span> {new Date(end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleModalOpen}
          className="flex items-center gap-x-2 justify-center font-normal bg-[#00936C] text-white px-4 py-2 hover:bg-green-800 hover:text-white rounded-md text-[13px] mt-4 lg:mt-0"
        >
          <img src={icon} alt="Required Documents" />
          Required Documents
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-xs font-normal text-gray-400">Special Request</h3>
        <p className="text-sm font-medium text-gray-600">{special_request}</p>
      </div>

      <DocumentsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        documents={requiredDocuments}
      />
    </div>
  );
};

export default BookingInfo;
