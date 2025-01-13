import React from "react";
import { useDropzone } from "react-dropzone";
import logo from "../../../../assets/uploadlogo.png";
import trashIcon from "../../../../assets/trashIcon.svg";
import { BiErrorAlt } from "react-icons/bi";

const LicenseDetailsForm = ({
  licenseNumber,
  setLicenseNumber,
  frontLicense,
  setFrontLicense,
  backLicense,
  setBackLicense,
  errors,
  setErrors,
}) => {
  const [frontPreview, setFrontPreview] = React.useState(null);
  const [backPreview, setBackPreview] = React.useState(null);

  const onDrop = (files, side) => {
    const file = files[0];
    if (!file) return;

    if (file.size > 2097152) {
      setErrors((prev) => ({
        ...prev,
        [`${side}License`]: "File must be less than 2 MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (side === "front") {
        setFrontPreview(reader.result);
        setFrontLicense(file);
      } else {
        setBackPreview(reader.result);
        setBackLicense(file);
      }
      setErrors((prev) => ({ ...prev, [`${side}License`]: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (side) => {
    if (side === "front") {
      setFrontLicense(null);
      setFrontPreview(null);
    } else {
      setBackLicense(null);
      setBackPreview(null);
    }
    setErrors((prev) => ({ ...prev, [`${side}License`]: "" }));
  };

  const handleFocus = (fieldName) => {
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleBlur = (fieldName, value) => {
    if (!value.trim()) {
      const formattedFieldName = fieldName
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()
        .replace(/^./, (str) => str.toUpperCase());
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `${formattedFieldName} is required`,
      }));
    }
  };

  const handleLicenseNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setLicenseNumber(value);
    }
  };

  const { getRootProps: getRootPropsFront, getInputProps: getInputPropsFront } =
    useDropzone({
      onDrop: (files) => onDrop(files, "front"),
      accept: {
        "image/jpeg": [],
        "image/png": [],
      },
      maxFiles: 1,
    });

  const { getRootProps: getRootPropsBack, getInputProps: getInputPropsBack } =
    useDropzone({
      onDrop: (files) => onDrop(files, "back"),
      accept: {
        "image/jpeg": [],
        "image/png": [],
      },
      maxFiles: 1,
    });

  return (
    <div className="px-6 py-8 bg-white rounded-lg border border-gray-200 shadow-sm font-sans">
      <label className="block text-base font-light text-gray-600 mb-4">
        Please provide the details of your driver's license
      </label>
      <label className="block text-sm font-thin text-gray-600 mb-2">
        License Number
      </label>
      <input
        type="text"
        value={licenseNumber}
        onChange={handleLicenseNumberChange}
        onFocus={() => handleFocus("licenseNumber")}
        onBlur={() => handleBlur("licenseNumber", licenseNumber)}
        className={`p-2 border outline-none rounded-md lg:w-3/4 w-full ${
          errors.licenseNumber ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="License number"
      />
      {errors.licenseNumber && (
        <div
          className="text-red-500 text-xs flex items-center
             gap-1 mt-1"
        >
          <BiErrorAlt />{" "}
          <p className="text-xs font-thin text-red-500">
            {errors.licenseNumber}
          </p>
        </div>
      )}

      <div className="flex space-x-4 lg:w-3/4 w-full mt-8">
        <div
          {...getRootPropsFront()}
          className="relative max-h-32 w-1/2 p-2 bg-gray-50 border-dashed border border-gray-300 rounded-lg cursor-pointer flex flex-col justify-center items-center"
        >
          <input {...getInputPropsFront()} />
          {!frontPreview ? (
            <>
              <img
                src={logo}
                alt="Upload Front"
                className="h-6 w-6 text-gray-500 mb-2"
              />
              <p className="text-xs text-gray-600">
                Drop here or click to upload front side
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => handleDelete("front")}
                className="absolute top-2 right-2 "
              >
                <img src={trashIcon} alt="" className="h-6"></img>
              </button>
              <img
                src={frontPreview}
                alt="Front Preview"
                className="h-full w-full object-cover rounded-lg"
              />
            </>
          )}
          {errors.frontLicense && (
            <div
              className="text-red-500 text-xs flex items-center
                gap-1 mt-1"
            >
              <BiErrorAlt />{" "}
              <p className="text-xs text-red-500">{errors.frontLicense}</p>
            </div>
          )}
        </div>
        <div
          {...getRootPropsBack()}
          className="relative max-h-32 w-1/2 p-2 bg-gray-50 border-dashed border border-gray-300 rounded-lg cursor-pointer flex flex-col justify-center items-center"
        >
          <input {...getInputPropsBack()} />
          {!backPreview ? (
            <>
              <img
                src={logo}
                alt="Upload Back"
                className="h-6 w-6 text-gray-500 mb-2"
              />
              <p className="text-xs text-gray-600">
                Drop here or click to upload back side
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => handleDelete("front")}
                className="absolute top-2 right-2 "
              >
                <img src={trashIcon} alt="" className="h-6"></img>
              </button>
              <img
                src={backPreview}
                alt="Back Preview"
                className="h-full w-full object-cover rounded-lg"
              />
            </>
          )}
          {errors.backLicense && (
            <div
              className="text-red-500 text-xs flex items-center
                gap-1 mt-1"
            >
              <BiErrorAlt />{" "}
              <p className="text-xs text-red-500">{errors.backLicense}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LicenseDetailsForm;
