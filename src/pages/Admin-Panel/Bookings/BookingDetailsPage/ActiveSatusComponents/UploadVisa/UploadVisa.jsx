import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import trashIcon from "../../../../../../assets/trashIcon.svg";
import logo from "../../../../../../assets/upload.svg";
import { BiErrorAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { updateBookingDocumentStatus, deleteBookingDocument, getBookingDetails } from '../../../../../../utility/Api';
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

const UploadVisa = ({ isEditing, booking }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { REACT_APP_API_BASE_URL } = process.env;

  useEffect(() => {
    if (isEditing && booking) {
      const existingFiles = booking.booking_documents
        .filter(doc => doc.document_for === "eVisa")
        .map(doc => ({
          file: new File([], doc.document_link.split('/').pop()), // Create a file-like object
          previewUrl: `${REACT_APP_API_BASE_URL}${doc.document_link}`
        }));
      setSelectedFiles(existingFiles);
    } else {
      const savedData = JSON.parse(localStorage.getItem("UploadLogo"));
      if (savedData && savedData.files) {
        const files = savedData.files.map(savedFile => new File([savedFile], savedFile.name, { type: savedFile.type }));
        setSelectedFiles(files);
      } else {
        localStorage.removeItem("UploadLogo");
      }
    }
  }, [isEditing, booking, REACT_APP_API_BASE_URL]);

  const onDrop = async (acceptedFiles) => {
    const validFiles = acceptedFiles.filter(file => file.size <= 2 * 1024 * 1024);
    if (validFiles.length !== acceptedFiles.length) {
      setFileErrors(["Some files were too large and not accepted (Max size: 2MB)"]);
    } else {
      setFileErrors([]);
    }

    const newFiles = validFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);

    for (let { file } of newFiles) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result;
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          base64: base64data,
        };

        try {
          setIsLoading(true);
          const response = await updateBookingDocumentStatus(
            booking.partner_session_token,
            booking.booking_number,
            'eVisa',
            file,
            booking.user_session_token
          );
          toast.success('eVisa uploaded successfully!');
        } catch (error) {
          console.error('API call failed:', error);
          setErrorMessage('Failed to upload eVisa.');
          toast.error('Failed to upload eVisa.');
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 5,
  });

  const handleDelete = async (fileToDelete) => {
    if (isEditing) {
      const document = booking.booking_documents.find(doc => doc.document_link.split('/').pop() === fileToDelete.file.name);
      if (document) {
        const documentId = document.document_id;
        try {
          const props = {
            session_token: booking.user_session_token,
            document_id: documentId,
            booking_number: booking.booking_number,
            partner_session_token: booking.partner_session_token,
          };
          await deleteBookingDocument(props);
          toast.success('eVisa deleted successfully!');
          const updatedBooking = await getBookingDetails(booking.partner_session_token, booking.booking_number);
          // Assuming setBooking is available here if needed
        } catch (error) {
          console.error('Failed to delete eVisa:', error);
          toast.error('Failed to delete eVisa.');
        }
      }
    }
    setSelectedFiles(prevFiles => prevFiles.filter(file => file.file !== fileToDelete.file));
  };

  return (
    <div className="flex flex-col lg:flex-row items-start mt-5 md:mt-0">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="space-y-6 w-full">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <label className="block font-semibold text-[20px] text-[#4B465C] mb-2 opacity-80">
            Upload eVisa
          </label>
          <div
            {...getRootProps()}
            className="h-[204px] w-full border border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer mb-4"
          >
            <input {...getInputProps()} />
            <div className="bg-[#f1f0f2] py-1 px-3 rounded-md">
              <img src={logo} alt="Upload Icon" className="h-10 w-10 mb-2" />
            </div>
            <p className="text-[#4B465C] font-semibold md:text-[22px] text-[14px] justify-center text-center opacity-80 pt-2">
              Drop files here or click to upload
            </p>
            <p className="text-[#4B465C] font-normal md:text-[15px] text-[12px] mt-3 md:mt-0 justify-center text-center opacity-80">
              (This is just a demo dropzone. Selected files are not actually uploaded.)
            </p>
          </div>
          <div className="w-full overflow-y-auto max-h-80 rounded-lg p-2 space-y-2">
            {selectedFiles.map(({ file, previewUrl }) => (
              <div key={file.name} className="flex items-center justify-between py-2 px-4 bg-gray-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  {file.type.startsWith('image/') && (
                    <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete({ file, previewUrl })}
                  className="text-red-500 hover:text-red-600"
                >
                  <img src={trashIcon} alt="Delete Icon" className="h-8 w-8" />
                </button>
              </div>
            ))}
          </div>
          {fileErrors.length > 0 && (
            <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <BiErrorAlt />
              <p className="text-xs text-red-500">{fileErrors.join(', ')}</p>
            </div>
          )}
          {errorMessage && (
            <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <BiErrorAlt />
              <p className="text-xs text-red-500">{errorMessage}</p>
            </div>
          )}
          <div className="mt-4 bg-[#FBF4D8] p-4 rounded">
            <p className="md:text-[14px] text-[10px] justify-center text-center text-[#4B465C] opacity-80 font-k2d">
              Ensure your file is saved in a suitable format, such as PNG, JPG, JPEG, PDF, DOC, or DOCX. The file size must be less than 2 MB.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 justify-center py-2 px-4 h-[50px] border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-[#00936ce0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full flex items-center"
        >
          Go to previous page
        </button>
      </div>
    </div>
  );
};

export default UploadVisa;
