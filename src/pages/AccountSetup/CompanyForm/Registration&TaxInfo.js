import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { BiErrorAlt } from "react-icons/bi";
import logo from "../../../assets/uploadlogo.png";
import trashIcon from "../../../assets/trashIcon.svg";

const options = [
  { value: "incorporationLicense", label: "Incorporation license" },
  { value: "DTSLicense", label: "DTS license" },
  { value: "NTNLicense", label: "NTN license" },
  { value: "moraLicense", label: "Mora license" },
  { value: "iataLicense", label: "IATA license" },

];

const RegistrationTaxForm = ({ formData, onChange, onNextTab }) => {
  const [selectedLicense, setSelectedLicense] = useState(
    formData?.selectedLicense || options[0]
  );
  const [incorporationNumber, setIncorporationNumber] = useState(
    formData?.incorporationNumber || ""
  );
  const [errors, setErrors] = useState({
    incorporationNumber: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const incorporationNumberRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(
      "Registration&TaxInfo",
      JSON.stringify({
        ...formData,
        selectedLicense,
        incorporationNumber,
      })
    );
  }, [selectedLicense, incorporationNumber]);

  useEffect(() => {
    const storedImage = localStorage.getItem("company_certificate");
    if (storedImage) {
      setImagePreview(storedImage);
    }
  }, []);

  const notifyParent = (updatedData) => {
    if (onChange) {
      onChange(updatedData);
    }
  };

  const handleFieldChange = (field, value) => {
    let updatedData = {
      ...formData,
      selectedLicense,
      incorporationNumber,
    };

    switch (field) {
      case "incorporationNumber":
        setIncorporationNumber(value);
        updatedData.incorporationNumber = value;
        break;
      case "selectedLicense":
        setSelectedLicense(value);
        updatedData.selectedLicense = value;
        break;
      default:
        break;
    }

    notifyParent(updatedData);
  };

  const validateField = (field, value) => {
    if (!value.trim()) {
      return field === "incorporationNumber"
        ? "Incorporation number is required"
        : "";
    }
    return "";
  };

  const validate = () => {
    let valid = true;
    const newErrors = {};

    const fieldsToValidate = {
      incorporationNumber: incorporationNumber,
    };

    Object.entries(fieldsToValidate).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        valid = false;
      }
    });

    if (!selectedFile && !imagePreview) {
      newErrors.image = "Image is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleBlur = (field) => {
    const fieldsToValidate = {
      incorporationNumber: incorporationNumber,
    };
    const error = validateField(field, fieldsToValidate[field]);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleContinue = () => {
    if (!validate()) {
      [incorporationNumberRef].find((ref) => {
        if (ref.current && errors[ref.current.name]) {
          ref.current.focus();
          return true;
        }
        return false;
      });
    } else {
      onNextTab();
      const RegistrationAndTaxInfo = JSON.parse(
        localStorage.getItem("Registration&TaxInfo")
      );
    }
  };

  const handleLicenseChange = (selectedOption) => {
    handleFieldChange("selectedLicense", selectedOption);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "File size should be 2MB or less",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("company_certificate", reader.result);
      setImagePreview(reader.result);
      setSelectedFile(file);
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "",
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setImagePreview(null);
    localStorage.removeItem("company_certificate");
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6">
      <div className="space-y-4 lg:w-3/4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <label htmlFor="phoneNumber" className="block text-xs font-light text-gray-600 mb-2">
            Add your company authenticity
            {" "}
            <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
              *
              </span>
          </label>
          <Select
            value={selectedLicense}
            onChange={handleLicenseChange}
            options={options}
            styles={{
              control: (provided, state) => ({
                ...provided,
                fontSize: "0.75rem",
                borderColor: state.isFocused ? "#00936C" : "#cbd5e0",
                width: "100%",
                "@media (min-width: 1024px)": {
                  width: "100%",
                },
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? "#f2f2f2" : "inherit",
                color: state.isSelected ? "#00936C" : "inherit",
                fontWeight: state.isSelected ? "normal" : "inherit",
                fontSize: "0.9rem",
              }),
            }}
            classNamePrefix="react-select"
            className={`react-select-container lg:w-3/4 ${errors.countryRegion ? "border-red-500" : "border-gray-400"
              }`}
          />
          <label htmlFor="phoneNumber" className="block text-xs font-light text-gray-600 mb-2 mt-4">
            {selectedLicense.label}
            {" "}
            <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
              *
              </span>
          </label>
          <input
            ref={incorporationNumberRef}
            name="incorporationNumber"
            type="text"
            value={incorporationNumber}
            onChange={(e) =>
              handleFieldChange("incorporationNumber", e.target.value)
            }
            onBlur={() => handleBlur("incorporationNumber")}
            className={`p-2 border outline-none rounded-md w-full lg:w-3/4 font-thin text-sm shadow-sm ${errors.incorporationNumber && "border-red-500"
              }`}
            placeholder={`e.g., ${selectedLicense.label}`}
          />
          {errors.incorporationNumber && (
            <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <BiErrorAlt />{" "}
              <p className="text-xs font-thin text-red-500">
                {errors.incorporationNumber}
              </p>
            </div>
          )}
          <label htmlFor="phoneNumber" className="block text-xs font-light text-gray-600 mb-2 mt-4">
            Upload Your Company License Photo
          </label>
          <div
            className="lg:w-3/4 h-40 w-full border border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer mb-4"
            onClick={handleButtonClick}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <img src={logo} alt="Upload Icon" className="h-10 w-10 mb-2" />
            <p className="text-gray-600 font-light">
              Drag & drop your License Photo
            </p>
            <button className="mt-2 py-1 px-3 border border-gray-300 rounded-md text-sm font-light text-gray-600">
              Choose files
            </button>
          </div>
          {imagePreview && (
            <div className="lg:w-3/4 w-full overflow-y-auto rounded-lg p-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 px-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <img
                      src={imagePreview}
                      alt="Company"
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
          {errors.image && (
            <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <BiErrorAlt />{" "}
              <p className="text-xs text-red-500">{errors.image}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleContinue}
          className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
        >
          Continue
        </button>
      </div>

      <div className="mt-4 lg:mt-0 lg:w-1/4 h-1/4 p-4 bg-[#E6F4F0] rounded-lg border border-green-200 shadow-sm">
        <p className="text-xs text-gray-700">
          Please ensure that the information you provide is accurate and
          carefully considered. HUZ Solutions will verify the data submitted
          during registration prior to listing your company on the platform.
        </p>
      </div>
    </div>
  );
};

export default RegistrationTaxForm;
