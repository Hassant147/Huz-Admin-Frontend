import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import logo from "../../../../assets/uploadlogo.svg";
import trashIcon from "../../../../assets/trashIcon.svg";
import Header from "../../../../components/Headers/HeaderForAdminPanel";
import NavigationBar from "../../../../components/NavigationBarForContent";
import Footer from "../../../../components/Footers/FooterForLoggedIn";
import Select from "react-select";

import {
  submitTransportPackage,
  updateTransportPackage,
  updateTransportPackagePhoto,
} from "../../../../utility/Api";
import Loader from "../../../../components/loader";
import { BiErrorAlt } from "react-icons/bi";

const IndTransportForm = ({ title, localStorageKey }) => {
  const navigate = useNavigate();

  const storedData = localStorage.getItem("editTransportPackage");
  const initialFormData = storedData ? JSON.parse(storedData) : {};
  const isEditing = initialFormData.isEditing || false;

  const [vehicleDetails, setVehicleDetails] = useState({
    vehicleType: initialFormData.transport_type || "",
    vehicleNameAndModel: initialFormData.name_and_model || "",
    licensePlateNo: initialFormData.plate_no || "",
    sittingCapacity: initialFormData.sitting_capacity || "",
    startLocation: initialFormData.common_1 || "",
    endLocation: initialFormData.common_2 || "",
    cost: initialFormData.cost || "",
    amenities: initialFormData.availability
      ? initialFormData.availability.split(", ")
      : [],
    files: [],
    filePreviews: initialFormData.vehicle_photos
      ? [{ preview: `http://13.213.42.27${initialFormData.vehicle_photos}` }]
      : [],
  });

  const [fileError, setFileError] = useState("");
  const [category, setCategory] = useState(
    initialFormData.package_type || "Fix Route"
  );
  const [errors, setErrors] = useState({
    vehicleType: "",
    vehicleNameAndModel: "",
    licensePlateNo: "",
    sittingCapacity: "",
    startLocation: "",
    endLocation: "",
    cost: "",
    amenities: "",
    files: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(vehicleDetails));
  }, [vehicleDetails, localStorageKey]);

  useEffect(() => {
    return () => {
      vehicleDetails.filePreviews.forEach((file) =>
        URL.revokeObjectURL(file.preview)
      );
    };
  }, [vehicleDetails.filePreviews]);

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setFileError(
        "Please select valid image files (PNG, JPG, or JPEG) under 2 MB each."
      );
      return;
    }

    const validFiles = acceptedFiles.filter(
      (file) => file.size <= 2 * 1024 * 1024
    );
    if (validFiles.length !== acceptedFiles.length) {
      setFileError("Some files exceed the 2 MB size limit.");
      return;
    }

    const updatedPreviews = validFiles.map((file) => ({
      preview: URL.createObjectURL(file),
    }));

    setVehicleDetails((prev) => ({
      ...prev,
      files: [...validFiles],
      filePreviews: [...updatedPreviews],
    }));

    setFileError("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
    multiple: false,
    maxSize: 2 * 1024 * 1024,
  });

  const handleFieldChange = (field, value) => {
    setVehicleDetails((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const capitaizerFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const validateField = (field) => {
    const value = vehicleDetails[field];
    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [field]: capitaizerFirstLetter(`${field} is required `),
      }));
      return false;
    }
    return true;
  };

  const handleDelete = (fileIndex) => {
    setVehicleDetails((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== fileIndex),
      filePreviews: prev.filePreviews.filter((_, index) => index !== fileIndex),
    }));
  };

  const handleContinue = async () => {
    let isValid = true;
    [
      "vehicleType",
      "vehicleNameAndModel",
      "licensePlateNo",
      "sittingCapacity",
      "startLocation",
      "endLocation",
      "cost",
    ].forEach((field) => {
      isValid = validateField(field) && isValid;
    });

    if (vehicleDetails.amenities.length === 0) {
      setErrors((prev) => ({
        ...prev,
        amenities: "At least one amenity is required",
      }));
      isValid = false;
    }
    if (!category) {
      setErrors((prev) => ({
        ...prev,
        category: "Please select a category",
      }));
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      try {
        if (isEditing) {
          await updateTransportPackage(vehicleDetails, category);
          if (vehicleDetails.files.length > 0) {
            const response = await updateTransportPackagePhoto(
              vehicleDetails.files[0]
            );
            if (
              response.data.message ===
              "Invalid file format or size exceeds 2 MB limit."
            ) {
              setFileError(response.data.message);
            } else {
              localStorage.removeItem("editTransportPackage");
              navigate("/packages", {
                state: { selectedPackageType: "Transport" },
              });
            }
          }
          localStorage.removeItem("editTransportPackage");
          navigate("/packages", {
            state: { selectedPackageType: "Transport" },
          });
        } else {
          await submitTransportPackage(vehicleDetails, category);
          navigate("/packages", {
            state: { selectedPackageType: "Transport" },
          });
        }
      } catch (error) {
        console.error("Submission failed", error);
        alert("Submission failed: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderFilePreviews = () => {
    return vehicleDetails.filePreviews.map((file, index) => (
      <div
        key={index}
        className="flex items-center justify-between py-2 px-4 bg-gray-100 rounded-lg"
      >
        <div className="flex items-center space-x-2">
          <img
            src={file.preview}
            alt={`Preview ${index}`}
            className="w-10 h-10 object-cover rounded-md"
          />
          <span className="text-sm">{`file.name ||File ${index + 1}`}</span>
        </div>
        <button onClick={() => handleDelete(index)} className="text-red-500">
          <img src={trashIcon} alt="Delete" className="w-5 h-5" />
        </button>
      </div>
    ));
  };

  return (
    <div>
      <Header />
      <NavigationBar />
      <div className="flex flex-col w-[85%] mx-auto lg:flex-row lg:space-x-6 font-sans my-10">
        <div className="w-full">
          <div>
            <h3 className="text-2xl font-medium mb-1 text-gray-600">
              Transport Package Enrollment
            </h3>
            <p className="text-sm font-thin text-gray-500 mb-4">
              Start by telling us your package basic information.
            </p>
          </div>
          <div className="space-y-5 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h1 className="text-gray-600 mb-5">{title}</h1>
            <div className="grid md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">
                  Vehicle Type
                </label>
                <input
                  type="text"
                  value={vehicleDetails.vehicleType}
                  onChange={(e) =>
                    handleFieldChange("vehicleType", e.target.value)
                  }
                  onBlur={() => validateField("vehicleType")}
                  className={`p-2 outline-none border rounded-md w-full font-thin text-sm shadow-sm ${
                    errors.vehicleType ? "border-red-500" : ""
                  }`}
                />
                {errors.vehicleType && (
                  <div
                    className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
                  >
                    <BiErrorAlt />{" "}
                    <p className="text-red-500 text-xs">{errors.vehicleType}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">
                  Vehicle name and Model
                </label>
                <input
                  type="text"
                  value={vehicleDetails.vehicleNameAndModel}
                  onChange={(e) =>
                    handleFieldChange("vehicleNameAndModel", e.target.value)
                  }
                  onBlur={() => validateField("vehicleNameAndModel")}
                  className={`p-2 outline-none border rounded-md w-full font-thin text-sm shadow-sm ${
                    errors.vehicleNameAndModel ? "border-red-500" : ""
                  }`}
                />
                {errors.vehicleNameAndModel && (
                  <div
                    className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
                  >
                    <BiErrorAlt />{" "}
                    <p className="text-red-500 text-xs">
                      {errors.vehicleNameAndModel}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">
                  License Plate No.
                </label>
                <input
                  type="text"
                  value={vehicleDetails.licensePlateNo}
                  onChange={(e) =>
                    handleFieldChange("licensePlateNo", e.target.value)
                  }
                  onBlur={() => validateField("licensePlateNo")}
                  className={`p-2 outline-none border rounded-md w-full font-thin text-sm shadow-sm ${
                    errors.licensePlateNo ? "border-red-500" : ""
                  }`}
                />
                {errors.licensePlateNo && (
                  <div
                    className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
                  >
                    <BiErrorAlt />{" "}
                    <p className="text-red-500 text-xs">
                      {errors.licensePlateNo}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">
                  Sitting Capacity
                </label>
                <input
                  type="number"
                  value={vehicleDetails.sittingCapacity}
                  onChange={(e) =>
                    handleFieldChange("sittingCapacity", e.target.value)
                  }
                  onBlur={() => validateField("sittingCapacity")}
                  className={`p-2 outline-none border rounded-md w-full font-thin text-sm shadow-sm ${
                    errors.sittingCapacity ? "border-red-500" : ""
                  }`}
                />
                {errors.sittingCapacity && (
                  <div
                    className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
                  >
                    <BiErrorAlt />{" "}
                    <p className="text-red-500 text-xs">
                      {errors.sittingCapacity}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:flex gap-5 ">
              <div className="block mt-7 lg:w-3/5">
                <h1 className="mb-4">Vehicle Photo</h1>
                <div
                  {...getRootProps()}
                  className="h-40 w-full border border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer mb-4"
                >
                  <input {...getInputProps()} />
                  <img
                    src={logo}
                    alt="Upload Icon"
                    className="h-10 w-10 mb-2"
                  />
                  <p className="text-gray-600 font-light">
                    Drag & drop your files here or
                  </p>
                  <button className="mt-2 py-1 px-3 border border-gray-300 rounded-md text-sm font-light text-gray-600">
                    Choose files
                  </button>
                </div>
                {fileError && (
                  <div
                    className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
                  >
                    <BiErrorAlt />{" "}
                    <p className="text-red-500 text-xs">{fileError}</p>
                  </div>
                )}
                {vehicleDetails.filePreviews.length > 0 && (
                  <div
                    className="w-full overflow-y-auto rounded-lg p-2"
                    style={{ maxHeight: "200px" }}
                  >
                    <div className="space-y-2">{renderFilePreviews()}</div>
                  </div>
                )}
              </div>
              <div className="mt-11">
                <label className="block text-sm font-light text-[#484848] mb-4">
                  Availability
                </label>
                <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center mb-2 text-sm font-thin text-gray-500"
                    >
                      <input
                        style={{ accentColor: "#00936C" }}
                        type="checkbox"
                        checked={vehicleDetails.amenities.includes(amenity)}
                        onChange={() => {
                          const newAmenities =
                            vehicleDetails.amenities.includes(amenity)
                              ? vehicleDetails.amenities.filter(
                                  (a) => a !== amenity
                                )
                              : [...vehicleDetails.amenities, amenity];
                          handleFieldChange("amenities", newAmenities);
                        }}
                        className="mr-2 size-[16px]"
                      />
                      <label htmlFor={amenity} className="text-[15px]">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.amenities && (
                  <div
                    className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
                  >
                    <BiErrorAlt />{" "}
                    <p className="text-red-500 text-xs">{errors.amenities}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-5 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div>
              <label className="block text-sm font-light text-gray-600 mb-2">
                Which kind of service do you provide?
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="fixRoute"
                    name="category"
                    value="Fix Route"
                    checked={category === "Fix Route"}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="fixRoute" className="text-gray-600">
                    Fix Route
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="flexible"
                    name="category"
                    value="Flexible"
                    checked={category === "Flexible"}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="flexible" className="text-gray-600">
                    Flexible
                  </label>
                </div>
              </div>
              {errors.category && (
                <div
                  className="text-red-500 text-xs flex items-center
          gap-1 mt-1"
                >
                  <BiErrorAlt />{" "}
                  <p className="text-red-500 text-xs">{errors.category}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-5 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">
                  Start Location
                </label>
                <Select
                  name="startLocation"
                  value={
                    vehicleDetails.startLocation
                      ? {
                          value: vehicleDetails.startLocation,
                          label: vehicleDetails.startLocation,
                        }
                      : null
                  }
                  onChange={(option) =>
                    handleFieldChange("startLocation", option?.value)
                  }
                  onBlur={() => validateField("startLocation")}
                  options={[
                    { value: "", label: "Select Start Location" },
                    { value: "Makkah", label: "Makkah" },
                    { value: "Madinah", label: "Madinah" },
                    { value: "Jeddah", label: "Jeddah" },
                    {
                      value: "Home of HAZRAT MUHAMMAD صلى الله عليه وسلم",
                      label: "Home of HAZRAT MUHAMMAD صلى الله عليه وسلم",
                    },
                    { value: "Ghar-E-Soor", label: "Ghar-E-Soor" },
                    { value: "Taif", label: "Taif" },
                    { value: "Masjid al-Haram", label: "Masjid al-Haram" },
                    { value: "The Holy Kaaba", label: "The Holy Kaaba" },
                    { value: "Maqam Ibrahim", label: "Maqam Ibrahim" },
                    { value: "Hajar al-Aswad", label: "Hajar al-Aswad" },
                    { value: "Well of Zamzam", label: "Well of Zamzam" },
                    {
                      value: "Jabal al-Nour (Mount of Light)",
                      label: "Jabal al-Nour (Mount of Light)",
                    },
                    { value: "Cave of Hira", label: "Cave of Hira" },
                    { value: "Jannat al-Mualla", label: "Jannat al-Mualla" },
                    { value: "Masjid Aisha", label: "Masjid Aisha" },
                    { value: "Masjid al-Jinn", label: "Masjid al-Jinn" },
                    { value: "Masjid al-Khayf", label: "Masjid al-Khayf" },
                    { value: "Mina", label: "Mina" },
                    { value: "Arafat", label: "Arafat" },
                    { value: "Muzdalifah", label: "Muzdalifah" },
                    { value: "Masjid Ali Nabwi", label: "Masjid Ali Nabwi" },
                    { value: "Jannat Al-Baqi", label: "Jannat Al-Baqi" },
                    { value: "Quba Mosque", label: "Quba Mosque" },
                    { value: "Uhud Mountain", label: "Uhud Mountain" },
                    {
                      value: "Masjid Al-Qiblatain",
                      label: "Masjid Al-Qiblatain",
                    },
                    {
                      value: "The Baab-As-Salaam",
                      label: "The Baab-As-Salaam",
                    },
                    {
                      value: "Mosque Al Ghamamah",
                      label: "Mosque Al Ghamamah",
                    },
                    {
                      value: "Battlefield Of The Trench (Khandaq)",
                      label: "Battlefield Of The Trench (Khandaq)",
                    },
                  ]}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      fontSize: "0.75rem", // Adjust the font size here
                      borderColor: errors.startLocation
                        ? "#f56565"
                        : state.isFocused
                        ? "#718096"
                        : "#cbd5e0", // Border color for error, focused, or unfocused
                      width: "100%", // Set default width to 100%
                      boxShadow: state.isFocused ? "0 0 0 1px #718096" : null, // Add shadow when focused
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected
                        ? "#00936C"
                        : state.isFocused
                        ? "#f0f0f0"
                        : null, // Background color for selected or focused option
                    }),
                  }}
                  classNamePrefix="react-select"
                  className={`react-select-container w-full ${
                    errors.startLocation ? "border-red-500" : "border-gray-400"
                  }`}
                />

                {errors.startLocation && (
                  <div
                    className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
                  >
                    <BiErrorAlt />{" "}
                    <p className="text-red-500 text-xs">
                      {errors.startLocation}
                    </p>
                  </div>
                )}
              </div>
              {category === "Fix Route" ? (
                <div>
                  <label className="block text-sm font-light text-gray-600 mb-2">
                    End Location
                  </label>
                  <Select
                    name="endLocation"
                    value={
                      vehicleDetails.endLocation
                        ? {
                            value: vehicleDetails.endLocation,
                            label: vehicleDetails.endLocation,
                          }
                        : null
                    }
                    onChange={(option) =>
                      handleFieldChange("endLocation", option?.value)
                    }
                    onBlur={() => validateField("endLocation")}
                    options={[
                      { value: "", label: "Select End Location" },
                      { value: "Makkah", label: "Makkah" },
                      { value: "Madinah", label: "Madinah" },
                      { value: "Jeddah", label: "Jeddah" },
                      {
                        value: "Home of HAZRAT MUHAMMAD صلى الله عليه وسلم",
                        label: "Home of HAZRAT MUHAMMAD صلى الله عليه وسلم",
                      },
                      { value: "Ghar-E-Soor", label: "Ghar-E-Soor" },
                      { value: "Taif", label: "Taif" },
                      { value: "Masjid al-Haram", label: "Masjid al-Haram" },
                      { value: "The Holy Kaaba", label: "The Holy Kaaba" },
                      { value: "Maqam Ibrahim", label: "Maqam Ibrahim" },
                      { value: "Hajar al-Aswad", label: "Hajar al-Aswad" },
                      { value: "Well of Zamzam", label: "Well of Zamzam" },
                      {
                        value: "Jabal al-Nour (Mount of Light)",
                        label: "Jabal al-Nour (Mount of Light)",
                      },
                      { value: "Cave of Hira", label: "Cave of Hira" },
                      { value: "Jannat al-Mualla", label: "Jannat al-Mualla" },
                      { value: "Masjid Aisha", label: "Masjid Aisha" },
                      { value: "Masjid al-Jinn", label: "Masjid al-Jinn" },
                      { value: "Masjid al-Khayf", label: "Masjid al-Khayf" },
                      { value: "Mina", label: "Mina" },
                      { value: "Arafat", label: "Arafat" },
                      { value: "Muzdalifah", label: "Muzdalifah" },
                      { value: "Masjid Ali Nabwi", label: "Masjid Ali Nabwi" },
                      { value: "Jannat Al-Baqi", label: "Jannat Al-Baqi" },
                      { value: "Quba Mosque", label: "Quba Mosque" },
                      { value: "Uhud Mountain", label: "Uhud Mountain" },
                      {
                        value: "Masjid Al-Qiblatain",
                        label: "Masjid Al-Qiblatain",
                      },
                      {
                        value: "The Baab-As-Salaam",
                        label: "The Baab-As-Salaam",
                      },
                      {
                        value: "Mosque Al Ghamamah",
                        label: "Mosque Al Ghamamah",
                      },
                      {
                        value: "Battlefield Of The Trench (Khandaq)",
                        label: "Battlefield Of The Trench (Khandaq)",
                      },
                    ]}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        fontSize: "0.75rem", // Adjust the font size here
                        borderColor: errors.endLocation
                          ? "#f56565"
                          : state.isFocused
                          ? "#718096"
                          : "#cbd5e0", // Border color for error, focused, or unfocused
                        width: "100%", // Set default width to 100%
                        boxShadow: state.isFocused ? "0 0 0 1px #718096" : null, // Add shadow when focused
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                          ? "#00936C"
                          : state.isFocused
                          ? "#f0f0f0"
                          : null, // Background color for selected or focused option
                      }),
                    }}
                    classNamePrefix="react-select"
                    className={`react-select-container w-full ${
                      errors.endLocation ? "border-red-500" : "border-gray-400"
                    }`}
                  />

                  {errors.endLocation && (
                    <div
                      className="text-red-500 text-xs flex items-center
              gap-1 mt-1"
                    >
                      <BiErrorAlt />{" "}
                      <p className="text-red-500 text-xs">
                        {errors.endLocation}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-light text-gray-600 mb-2">
                    Flexible type
                  </label>
                  <Select
                    name="endLocation"
                    value={
                      vehicleDetails.endLocation
                        ? {
                            value: vehicleDetails.endLocation,
                            label: vehicleDetails.endLocation,
                          }
                        : null
                    }
                    onChange={(option) =>
                      handleFieldChange("endLocation", option?.value)
                    }
                    onBlur={() => validateField("endLocation")}
                    options={[
                      { value: "", label: "Select Flexible type" },
                      { value: "Per Hour", label: "Per Hour" },
                      { value: "Per Day", label: "Per Day" },
                      { value: "Per Week", label: "Per Week" },
                      { value: "Per Month", label: "Per Month" },
                    ]}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        fontSize: "0.75rem", // Adjust the font size here
                        borderColor: errors.endLocation
                          ? "#f56565"
                          : state.isFocused
                          ? "#718096"
                          : "#cbd5e0", // Border color for error, focused, or unfocused
                        width: "100%", // Set default width to 100%

                        boxShadow: state.isFocused ? "0 0 0 1px #718096" : null, // Add shadow when focused
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                          ? "#00936C"
                          : state.isFocused
                          ? "#f0f0f0"
                          : null, // Background color for selected or focused option
                      }),
                    }}
                    classNamePrefix="react-select"
                    className={`react-select-container w-full ${
                      errors.endLocation ? "border-red-500" : "border-gray-400"
                    }`}
                  />

                  {errors.endLocation && (
                    <div
                      className="text-red-500 text-xs flex items-center
              gap-1 mt-1"
                    >
                      <BiErrorAlt />{" "}
                      <p className="text-red-500 text-xs mt-1">
                        {errors.endLocation}
                      </p>
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-light text-gray-600 mb-2">
                  Cost
                </label>
                <input
                  type="number"
                  value={vehicleDetails.cost}
                  onChange={(e) => handleFieldChange("cost", e.target.value)}
                  onBlur={() => validateField("cost")}
                  className={`p-2 outline-none border rounded-md w-full font-thin text-sm shadow-sm ${
                    errors.cost ? "border-red-500" : ""
                  }`}
                />
                {errors.cost && (
                  <div
                    className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
                  >
                    <BiErrorAlt />{" "}
                    <p className="text-red-500 text-xs">{errors.cost}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleContinue}
            className="mt-6 inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
          >
            Submit
            {loading && <Loader className="ml-2" />}
          </button>
        </div>
        <div className="mt-4 lg:mt-20 lg:w-1/4 h-1/4 p-4 bg-[#E6F4F0] rounded-lg border border-green-200 shadow-sm">
          <p className="text-xs text-gray-600">
            Please ensure that the information you provide is accurate and
            carefully considered. HUZ Solutions will verify the data submitted
            during registration prior to listing your company on the platform.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default IndTransportForm;
