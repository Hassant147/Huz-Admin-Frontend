import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf, FaFileWord, FaFileImage } from 'react-icons/fa';
import dlt from '../../../../../../assets/booking/delete.svg';
import toast from 'react-hot-toast';

const getFileIcon = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return <FaFilePdf className="text-red-500" />;
    case 'doc':
    case 'docx':
      return <FaFileWord className="text-blue-500" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <FaFileImage className="text-green-500" />;
    default:
      return <FaFileImage className="text-gray-500" />;
  }
};

const VisaDetails = ({ booking, onDelete }) => {
  const [documents, setDocuments] = useState([]);
  const { REACT_APP_API_BASE_URL } = process.env;
  const navigate = useNavigate();

  useEffect(() => {
    if (booking.booking_documents_status[0].is_visa_completed) {
      const visaDocuments = booking.booking_documents.filter(doc => doc.document_for === 'eVisa');
      setDocuments(visaDocuments);
    }
  }, [booking]);

  const openDocument = (documentLink) => {
    window.open(`${REACT_APP_API_BASE_URL}${documentLink}`, '_blank');
  };

  const handleAddMore = () => {
    navigate("/package/upload-evisa", { state: { isEditing: true } });
  };

  return (
    <div className="space-y-2 py-2">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium text-gray-500">Shared Visa detail</h2>
        <button
          onClick={handleAddMore}
          className="text-white text-xs bg-[#00936C] hover:bg-[#007B54] rounded px-3 py-1.5"
        >
          Add more
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2 bg-gray-50 rounded">
        {documents.map((doc) => (
          <div key={doc.document_id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded shadow-sm">
            <div className="flex items-center space-x-2">
              {getFileIcon(doc.document_link)}
              <p className="text-sm text-gray-700 cursor-pointer" onClick={() => openDocument(doc.document_link)}>
                {doc.document_link.split('/').pop()}
              </p>
            </div>
            <button onClick={() => onDelete(doc.document_id)} className="text-red-500 hover:text-red-600">
              <img src={dlt} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisaDetails;
