import React from "react";
import Select from "react-select";
import countries from "country-json/src/country-by-name.json"; // Adjust the path if necessary
import { BiErrorAlt } from "react-icons/bi";

const AddressDetailsForm = ({
  streetAddress,
  setStreetAddress,
  addressLine2,
  setAddressLine2,
  countryRegion,
  setCountryRegion,
  city,
  setCity,
  postalCode,
  setPostalCode,
  errors,
  setErrors,
}) => {
  // Clear error on focus
  const handleFocus = (fieldName) => {
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  // Validate input on blur and format field name properly
  const handleBlur = (fieldName, value) => {
    if (!value.trim()) {
      const formattedFieldName = fieldName
        .replace(/([A-Z])/g, " $1") // Adds space before capital letters
        .toLowerCase() // Converts to lowercase
        .replace(/^./, (str) => str.toUpperCase()) // Capitalizes the first letter of the string
        .replace(/ ([a-z])/g, (match) => match.toUpperCase()); // Capitalizes the first letter of each word
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `${formattedFieldName} is required`,
      }));
    }
  };

  const countryOptions = countries.map((country) => ({
    value: country.country,
    label: country.country,
  }));

  return (
    <div className="px-6 py-8 bg-white rounded-lg border border-gray-200 shadow-sm font-sans">
      <label className="block text-normal font-light text-gray-600 mb-4">
        Address details
      </label>

      {/* Street Address */}
      <label className="block text-sm font-thin text-gray-600 mb-2">
        Street address
      </label>
      <input
        type="text"
        value={streetAddress}
        onChange={(e) => setStreetAddress(e.target.value)}
        onFocus={() => handleFocus("streetAddress")}
        onBlur={() => handleBlur("streetAddress", streetAddress)}
        className={`p-2 border outline-none rounded-md lg:w-3/4 w-full font-thin text-sm shadow-sm ${
          errors.streetAddress ? "border-red-500" : ""
        }`}
        placeholder="Street address (e.g., 123 easy street)"
      />
      {errors.streetAddress && (
        <div
          className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
        >
          <BiErrorAlt />{" "}
          <p className="text-xs font-thin text-red-500">
            {errors.streetAddress}
          </p>
        </div>
      )}

      {/* Address Line 2 */}
      <label className="block mt-4 text-sm font-thin text-gray-600 mb-2">
        Address line 2
      </label>
      <input
        type="text"
        value={addressLine2}
        onChange={(e) => setAddressLine2(e.target.value)}
        className="p-2 border outline-none rounded-md mb-4 lg:w-3/4 w-full font-thin text-sm shadow-sm"
        placeholder="Address line 2 (Unit number, suite, floor, building, etc.)"
      />

      {/* Country/Region */}
      <label className="block text-sm font-thin text-gray-600 mb-2">
        Country/region
      </label>
      <Select
        value={countryOptions.find((option) => option.value === countryRegion)}
        onChange={(option) => setCountryRegion(option?.value)}
        onFocus={() => handleFocus("countryRegion")}
        onBlur={() => handleBlur("countryRegion", countryRegion)}
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
        className={`react-select-container  lg:w-3/4 ${
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
      <label className="mt-4 block text-sm font-thin text-gray-600 mb-2">
        City
      </label>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onFocus={() => handleFocus("city")}
        onBlur={() => handleBlur("city", city)}
        className={`p-2 border outline-none rounded-md lg:w-3/4 w-full font-thin text-sm shadow-sm ${
          errors.city ? "border-red-500" : ""
        }`}
        placeholder="City (e.g., New York)"
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
      <label className="mt-4 block text-sm font-thin text-gray-600 mb-2">
        Postal code
      </label>
      <input
        type="text"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        onFocus={() => handleFocus("postalCode")}
        onBlur={() => handleBlur("postalCode", postalCode)}
        className={`p-2 border outline-none rounded-md lg:w-3/4 w-full font-thin text-sm shadow-sm ${
          errors.postalCode ? "border-red-500" : ""
        }`}
        placeholder="Postal code"
      />
      {errors.postalCode && (
        <div
          className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
        >
          <BiErrorAlt />{" "}
          <p className="text-xs font-thin text-red-500">{errors.postalCode}</p>
        </div>
      )}
    </div>
  );
};

export default AddressDetailsForm;
