import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import countries from "country-json/src/country-by-name.json"; // Adjust the path if necessary
import { BiErrorAlt } from "react-icons/bi";

const CompanyLocationForm = ({ formData, onChange, onNextTab }) => {
  const [streetAddress, setStreetAddress] = useState(
    formData?.streetAddress || ""
  );
  const [addressLine2, setAddressLine2] = useState(
    formData?.addressLine2 || ""
  );
  const [countryRegion, setCountryRegion] = useState(
    formData?.countryRegion || ""
  );
  const [city, setCity] = useState(formData?.city || "");
  const [postalCode, setPostalCode] = useState(formData?.postalCode || "");
  const [errors, setErrors] = useState({
    streetAddress: "",
    countryRegion: "",
    city: "",
    postalCode: "",
  });

  const streetAddressRef = useRef(null);
  const countryRegionRef = useRef(null);
  const cityRef = useRef(null);
  const postalCodeRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("AddressDetail", JSON.stringify(formData));
  }, [formData]);

  const validateField = (field, value) => {
    let error = "";
    if (!value.trim()) {
      switch (field) {
        case "streetAddress":
          error = "Street address is required";
          break;
        case "countryRegion":
          error = "Country/region is required";
          break;
        case "city":
          error = "City is required";
          break;
        case "postalCode":
          error = "Postal code is required";
          break;
        default:
          break;
      }
    } else {
      if (field === "postalCode" && value.length > 10) {
        error = "Postal code cannot exceed 10 characters";
      }
    }
    return error;
  };

  const validate = () => {
    let valid = true;
    const newErrors = {};

    ["streetAddress", "countryRegion", "city", "postalCode"].forEach(
      (field) => {
        newErrors[field] = validateField(field, eval(field));
        if (newErrors[field]) valid = false;
      }
    );

    setErrors(newErrors);
    return valid;
  };

  const handleFieldChange = (field, value) => {
    const updatedData = {
      streetAddress,
      addressLine2,
      countryRegion,
      city,
      postalCode,
      [field]: value,
    };

    switch (field) {
      case "streetAddress":
        setStreetAddress(value);
        break;
      case "addressLine2":
        setAddressLine2(value);
        break;
      case "countryRegion":
        setCountryRegion(value);
        break;
      case "city":
        setCity(value);
        break;
      case "postalCode":
        setPostalCode(value);
        break;
      default:
        break;
    }

    const error = validateField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    onChange(updatedData);
  };

  const handleBlur = (field) => {
    const error = validateField(field, eval(field));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleContinue = () => {
    if (!validate()) {
      [streetAddressRef, countryRegionRef, cityRef, postalCodeRef].find(
        (ref) => {
          if (ref.current && errors[ref.current.name]) {
            ref.current.focus();
            return true;
          }
          return false;
        }
      );
    } else {
      onNextTab();
      const AddressDetail = JSON.parse(localStorage.getItem("AddressDetail"));
    }
  };

  const countryOptions = countries.map((country) => ({
    value: country.country,
    label: country.country,
  }));

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 font-sans">
      <div className="space-y-4 lg:w-3/4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:justify-between">
          <div className="lg:w-[60%]">
            {/* Street Address */}
            <label htmlFor="streetAddress" className="block text-xs font-light text-gray-600 mb-2">
              Street Address{" "}
              <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
                *
              </span>
            </label>
            <input
              ref={streetAddressRef}
              name="streetAddress"
              type="text"
              value={streetAddress}
              onChange={(e) =>
                handleFieldChange("streetAddress", e.target.value)
              }
              onBlur={() => handleBlur("streetAddress")}
              className={`p-2 border outline-none rounded-md w-full font-thin text-sm shadow-sm ${
                errors.streetAddress && "border-red-500"
              }`}
              placeholder="e.g., 123 Easy Street"
            />
            {errors.streetAddress && (
              <div
                className="text-red-500 text-xs flex items-center
             gap-1 mt-1"
              >
                <BiErrorAlt />{" "}
                <p className=" text-xs font-thin text-red-500">
                  {errors.streetAddress}
                </p>
              </div>
            )}

            {/* Address Line 2 */}
            <label className="block text-xs font-light text-gray-600 mb-2 mt-4">
              Address line 2
            </label>
            <input
              type="text"
              value={addressLine2}
              onChange={(e) =>
                handleFieldChange("addressLine2", e.target.value)
              }
              className="p-2 border outline-none rounded-md w-full font-thin text-sm shadow-sm"
              placeholder="Unit number, suite, floor, building, etc."
            />

            {/* Country/Region */}
            <label htmlFor="countryRegion" className="block text-xs font-light text-gray-600 mb-2 mt-4">
              Country/Region{" "}
              <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
                *
              </span>
            </label>
            <Select
              ref={countryRegionRef}
              name="countryRegion"
              value={countryOptions.find(
                (option) => option.value === countryRegion
              )}
              onChange={(option) =>
                handleFieldChange("countryRegion", option?.value)
              }
              onBlur={() => handleBlur("countryRegion")}
              options={countryOptions}
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  fontSize: "0.75rem", // Adjust the font size here
                  borderColor: state.isFocused ? "#718096" : "#cbd5e0", // Border color when focused or unfocused
                  width: "100%", // Set default width to 100%
                  "@media (min-width: 1024px)": {
                    width: "100%", // Set width to 3/4 for lg screens
                  },
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? "#00936C" : "inherit", // Set the background color for selected option
                }),
              }}
              className={`react-select-container ${
                errors.countryRegion ? "border-red-500" : "border-gray-400"
              }`}
              classNamePrefix="react-select"
            />
            {errors.countryRegion && (
              <div
                className="text-red-500 text-xs flex items-center
              gap-1 mt-1"
              >
                <BiErrorAlt />{" "}
                <p className="text-xs font-thin text-red-500">
                  {errors.countryRegion}
                </p>
              </div>
            )}

            {/* City */}
            <label htmlFor="city" className="block text-xs font-light text-gray-600 mb-2 mt-4">
              City{" "}
              <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
                *
              </span>
            </label>
            <input
              ref={cityRef}
              name="city"
              type="text"
              value={city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              onBlur={() => handleBlur("city")}
              className={`p-2 border outline-none rounded-md w-full font-thin text-sm shadow-sm ${
                errors.city && "border-red-500"
              }`}
              placeholder="e.g., New York"
            />
            {errors.city && (
              <div
                className="text-red-500 text-xs flex items-center
              gap-1 mt-1"
              >
                <BiErrorAlt />{" "}
                <p className="text-xs font-thin text-red-500">{errors.city}</p>
              </div>
            )}

            {/* Postal Code */}
            <label htmlFor="postalCode" className="block text-xs font-light text-gray-600 mb-2 mt-4">
              Postal code{" "}
              <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
                *
              </span>
            </label>
            <input
              ref={postalCodeRef}
              name="postalCode"
              type="text"
              value={postalCode}
              onChange={(e) => handleFieldChange("postalCode", e.target.value)}
              onBlur={() => handleBlur("postalCode")}
              maxLength="10"
              className={`p-2 border outline-none rounded-md w-full font-thin text-sm shadow-sm ${
                errors.postalCode && "border-red-500"
              }`}
              placeholder="Enter postal code"
            />
            {errors.postalCode && (
              <div
                className="text-red-500 text-xs flex items-center
              gap-1 mt-1"
              >
                <BiErrorAlt />{" "}
                <p className="text-xs font-thin text-red-500">
                  {errors.postalCode}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 lg:mt-6 lg:w-1/3 h-1/4 p-4 bg-[#F6F6F6] shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Your address matters
            </h2>
            <p className="text-xs text-gray-700">
              Please provide your complete company address, including building
              name and number, as we may verify this information.
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
        >
          Continue
        </button>
      </div>

      {/* Information Panel */}
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

export default CompanyLocationForm;
