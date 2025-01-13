import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import trashIcon from "../../../../../../assets/trashIcon.svg";
import logo from "../../../../../../assets/upload.svg";
import { BiErrorAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import {
  PostAirlineDetails,
  updateAirlineDetails,
  deleteBookingDocument,
  getBookingDetails,
  updateBookingDocumentStatus
} from '../../../../../../utility/Api';
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners'; // Import spinner component
import cities from "../../../../../../cities.json";

const UploadAirline = ({ booking, isEditing }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [flightDate, setFlightDate] = useState('');
  const [flightTime, setFlightTime] = useState('');
  const [flightFrom, setFlightFrom] = useState('');
  const [flightTo, setFlightTo] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const navigate = useNavigate();
  const { REACT_APP_API_BASE_URL } = process.env;

  useEffect(() => {
    if (isEditing && booking) {
      const existingFiles = booking.booking_documents
        .filter(doc => doc.document_for === "airline")
        .map(doc => ({
          file: new File([], doc.document_link.split('/').pop()), // Create a file-like object
          previewUrl: `${REACT_APP_API_BASE_URL}${doc.document_link}`
        }));
      setSelectedFiles(existingFiles);

      if (booking.booking_airline_details && booking.booking_airline_details.length > 0) {
        const flightDetails = booking.booking_airline_details[0];
        setFlightDate(flightDetails.flight_date ? flightDetails.flight_date.split('T')[0] : '');
        setFlightTime(flightDetails.flight_time || '');
        setFlightFrom(flightDetails.flight_from || '');
        setFlightTo(flightDetails.flight_to || '');
      }
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
            'airline',
            file,
            booking.user_session_token
          );
          toast.success('Airline ticket uploaded successfully!');
        } catch (error) {
          console.error('API call failed:', error);
          setErrorMessage('Failed to upload airline ticket.');
          toast.error('Failed to upload airline ticket.');
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

  const handleFieldChange = (field, value) => {
    if (field === "flightFrom") {
      setFlightFrom(value);
      setFromSuggestions(
        value ? cities.filter((city) => city.name.toLowerCase().includes(value.toLowerCase())) : []
      );
    } else if (field === "flightTo") {
      setFlightTo(value);
      setToSuggestions(
        value ? cities.filter((city) => city.name.toLowerCase().includes(value.toLowerCase())) : []
      );
    }
  };

  const handleBlur = (field) => {
    if (field === "flightFrom") {
      if (!flightFrom) {
        setErrorMessage("Flight from is required.");
      } else {
        setErrorMessage("");
      }
    } else if (field === "flightTo") {
      if (!flightTo) {
        setErrorMessage("Flight to is required.");
      } else {
        setErrorMessage("");
      }
    }
  };

  const handleClickOutside = (event) => {
    if (
      fromRef.current &&
      !fromRef.current.contains(event.target) &&
      toRef.current &&
      !toRef.current.contains(event.target)
    ) {
      setFromSuggestions([]);
      setToSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async () => {
    if (!flightDate || !flightTime || !flightFrom || !flightTo) {
      setErrorMessage("All fields are required.");
      return;
    }

    const flightDateTime = `${flightDate}T${flightTime}:00Z`;

    try {
      setIsLoading(true);
      if (isEditing) {
        await updateAirlineDetails(
          booking.partner_session_token,
          booking.booking_number,
          booking.booking_airline_details[0].booking_airline_id,
          flightDateTime,
          flightTime,
          flightFrom,
          flightTo
        );
        toast.success('Airline details updated successfully!');
      } else {
        await PostAirlineDetails(
          booking.partner_session_token,
          booking.booking_number,
          flightDateTime,
          flightTime,
          flightFrom,
          flightTo
        );
        toast.success('Airline details added successfully!');
      }
      navigate(-1);
    } catch (error) {
      console.error('API call failed:', error);
      setErrorMessage('Failed to update airline details.');
      toast.error('Failed to update airline details.');
    } finally {
      setIsLoading(false);
    }
  };

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
          toast.success('Airline ticket deleted successfully!');
          const updatedBooking = await getBookingDetails(booking.partner_session_token, booking.booking_number);
          // Assuming setBooking is available here if needed
        } catch (error) {
          console.error('Failed to delete airline ticket:', error);
          toast.error('Failed to delete airline ticket.');
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
          <div className="mb-5">
            <h1 className="text-gray-600 text-normal text-lg mb-2">
              Upload Airline Details
            </h1>
            <p className="text-sm text-gray-500 text-light">
              What are airline tickets date and time
            </p>
            <div className="flex flex-col md:flex-row gap-3 mt-4">
              <div className="lg:w-1/2">
                <label className="font-medium lg:text-[13px] md:text-[12px] text-[10px] text-[#4B465C] opacity-80 py-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="px-4 md:py-1.5 block rounded border-[2px] border-[#DEDDDD] w-full text-gray-500 font-thin"
                />
              </div>
              <div className="lg:w-1/2">
                <label className="font-medium lg:text-[13px] md:text-[12px] text-[10px] text-[#4B465C] opacity-80 py-1.5">
                  Time
                </label>
                <input
                  type="time"
                  value={flightTime}
                  onChange={(e) => setFlightTime(e.target.value)}
                  className="px-4 md:py-1.5 block rounded border-[2px] border-[#DEDDDD] w-full text-gray-500 font-thin"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 mt-3">
              <div className="lg:w-1/2 relative" ref={fromRef}>
                <label className="font-medium lg:text-[13px] md:text-[12px] text-[10px] text-[#4B465C] opacity-80 py-1.5">
                  Flight from
                </label>
                <input
                  type="text"
                  value={flightFrom}
                  onChange={(e) => handleFieldChange("flightFrom", e.target.value)}
                  onBlur={() => handleBlur("flightFrom")}
                  className="px-4 md:py-1.5 block rounded border-[2px] border-[#DEDDDD] w-full text-gray-500 font-thin"
                />
                {fromSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {fromSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          handleFieldChange("flightFrom", suggestion.name);
                          setFromSuggestions([]);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
                {errorMessage && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <BiErrorAlt />
                    <p className="text-xs text-red-500">{errorMessage}</p>
                  </div>
                )}
              </div>
              <div className="lg:w-1/2 relative" ref={toRef}>
                <label className="font-medium lg:text-[13px] md:text-[12px] text-[10px] text-[#4B465C] opacity-80 py-1.5">
                  Flight to
                </label>
                <input
                  type="text"
                  value={flightTo}
                  onChange={(e) => handleFieldChange("flightTo", e.target.value)}
                  onBlur={() => handleBlur("flightTo")}
                  className="px-4 md:py-1.5 block rounded border-[2px] border-[#DEDDDD] w-full text-gray-500 font-thin"
                />
                {toSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {toSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          handleFieldChange("flightTo", suggestion.name);
                          setToSuggestions([]);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
                {errorMessage && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <BiErrorAlt />
                    <p className="text-xs text-red-500">{errorMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <label className="text-gray-600 text-normal text-lg">
            Upload Airline Tickets
          </label>
          <div
            {...getRootProps()}
            className="mt-2 h-[204px] w-full border border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer mb-4"
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
            <p className="md:text-[14px] text-[10px] justify-center text-center text-[#4B465C] opacity-80 font-k2d ">
              Ensure your logo is saved in a suitable file format, such as PNG,
              JPG, or JPEG. The image should be square in shape and the file
              size must be less than 2 MB.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 justify-center py-2 px-4 h-[50px] border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-[#00936ce0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full flex items-center"
          disabled={isLoading}
        >
          {isLoading ? <ClipLoader size={20} color="#fff" /> : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default UploadAirline;
