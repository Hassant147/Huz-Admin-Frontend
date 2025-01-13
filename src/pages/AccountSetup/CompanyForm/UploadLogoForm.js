import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import logo from "../../../assets/uploadlogo.png";
import trashIcon from "../../../assets/trashIcon.svg";
import { uploadCompanyData } from "../../../utility/AuthApis";
import Loader from "../../../components/loader";
import { BiErrorAlt } from "react-icons/bi";
import ErrorMessage from "../../../components/ErrorMessage"; // Adjust the import path as necessary

const UploadLogoForm = ({
  basicDetails,
  addressDetails,
  registrationTaxInfo,
  companyOverview,
  onFormSubmit,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileError, setFileError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorStatus, setErrorStatus] = useState("");
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("UploadLogo"));
    if (savedData && savedData.file && savedData.previewUrl) {
      const file = new File([savedData.file], savedData.file.name, {
        type: savedData.file.type,
      });
      setSelectedFile(file);
      setPreviewUrl(savedData.previewUrl);
    } else {
      localStorage.removeItem("UploadLogo");
    }
  }, []);

  const onDrop = (acceptedFiles) => {
    const validFiles = acceptedFiles.filter(
      (file) => file.size <= 2 * 1024 * 1024
    );
    if (validFiles.length !== acceptedFiles.length) {
      setFileError(
        "Some files were too large and not accepted (Max size: 2MB)"
      );
    } else {
      setFileError("");
    }

    const file = validFiles[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(previewUrl);

      const fileData = {
        file,
        previewUrl,
      };
      localStorage.setItem("UploadLogo", JSON.stringify(fileData));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!selectedFile) {
      setFileError(
        "No image selected. Please choose an appropriate logo image."
      );
      return;
    }

    const companyCertificateDataUrl = localStorage.getItem("company_certificate");
    let companyCertificateFile = null;

    if (companyCertificateDataUrl) {
      const byteString = atob(companyCertificateDataUrl.split(',')[1]);
      const mimeString = companyCertificateDataUrl.split(',')[0].split(':')[1].split(';')[0];

      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      companyCertificateFile = new File([ab], "company_certificate.png", { type: mimeString });
    }

    setIsLoading(true);
    setErrorMessage("");
    setErrorStatus("");

    try {
      const response = await uploadCompanyData(
        basicDetails,
        addressDetails,
        registrationTaxInfo,
        companyOverview,
        selectedFile,
        companyCertificateFile
      );
      localStorage.setItem("SignedUp-User-Profile", JSON.stringify(response));
      localStorage.removeItem('company_certificate');
      localStorage.removeItem('AddressDetail');
      localStorage.removeItem('Registration&TaxInfo');
      localStorage.removeItem('CompanyOverview');
      localStorage.removeItem('basicDetails');
      onFormSubmit(response);

    } catch (error) {
      console.error("Error uploading company data:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred while uploading. Please try again later."
      );
      setErrorStatus(
        error.response?.status || "400 Bad Request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    localStorage.removeItem("UploadLogo");
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6">
      <div className="space-y-4 lg:w-3/4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <label htmlFor="phoneNumber" className="block text-sm font-light text-gray-600 mb-2">
            Upload Your Company Logo
          {" "}
            <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
              *
              </span>
          </label>

          <div
            {...getRootProps()}
            className="h-40 w-full border border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer mb-4"
          >
            <input {...getInputProps()} />
            <img src={logo} alt="Upload Icon" className="h-10 w-10 mb-2" />
            <p className="text-gray-600 font-light">
              Drag & drop your Company logo
            </p>
            <button className="mt-2 py-1 px-3 border border-gray-300 rounded-md text-sm font-light text-gray-600">
              Choose files
            </button>
          </div>
          {previewUrl && (
            <div className="w-full overflow-y-auto rounded-lg p-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 px-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {selectedFile ? selectedFile.name : ""}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedFile
                          ? (selectedFile.size / 1024).toFixed(2)
                          : ""}{" "}
                        KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-600"
                  >
                    <img
                      src={trashIcon}
                      alt="Delete Icon"
                      className="h-8 w-8"
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
          {fileError && (
            <div
              className="text-red-500 text-xs flex items-center gap-1 mt-1"
            >
              <BiErrorAlt />
              <p className="text-xs text-red-500">{fileError}</p>
            </div>
          )}
          {errorMessage && (
            <ErrorMessage message={errorMessage} status={errorStatus} />
          )}
          <div className="mt-4 bg-[#FBF4D8] border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-xs text-gray-700">
              Ensure your logo is saved in a suitable file format, such as PNG,
              JPG, or JPEG. The file size must be less than 2 MB.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full items-center"
          disabled={isLoading}
        >
          Submit
          {isLoading && <Loader />}
        </button>
      </div>
    </div>
  );
};

export default UploadLogoForm;
