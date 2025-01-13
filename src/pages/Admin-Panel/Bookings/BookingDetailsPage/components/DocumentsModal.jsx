import React from 'react';

const DocumentsModal = ({ isOpen, onClose, documents }) => {
  if (!isOpen) {
    return null;
  }

  const { REACT_APP_API_BASE_URL } = process.env;

  const getFileName = (documentLink) => {
    const parts = documentLink.split('/');
    return parts[parts.length - 1];
  };

  const handleViewDocument = (documentLink) => {
    window.open(`${REACT_APP_API_BASE_URL}${documentLink}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-3/4 max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-2 p-1 right-2 text-white hover:bg-red-600 bg-red-800 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Required Documents</h2>
        <div className="max-h-80 overflow-y-auto space-y-4">
          {documents.length > 0 ? (
            documents.map(doc => (
              <div key={doc.document_id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-600">{getFileName(doc.document_link)}</span>
                <button
                  onClick={() => handleViewDocument(doc.document_link)}
                  className="bg-[#00936C] text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                >
                  View
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No documents available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsModal;
