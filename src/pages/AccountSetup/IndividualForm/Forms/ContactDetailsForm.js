import React from "react";
import { BiErrorAlt } from "react-icons/bi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ContactDetailsForm = ({
  contactName,
  setContactName,
  contactNumber,
  setContactNumber,
  errors,
  setErrors,
}) => {
  // Handle the onFocus event to clear errors
  const handleFocus = (fieldName) => {
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  // Validate input on blur and format the field name properly
  const handleBlur = (fieldName, value) => {
    if (!value.trim()) {
      // Convert camelCase to words with first letter uppercase
      const formattedFieldName = fieldName
        .replace(/([A-Z])/g, " $1") // Insert space before capital letters
        .toLowerCase() // Convert to lowercase
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter of the string
        .replace(/ ([a-z])/g, (match) => match.toUpperCase()); // Capitalize the first letter of each word

      setErrors((prev) => ({
        ...prev,
        [fieldName]: `${formattedFieldName} is required`,
      }));
    }
  };

  // Handle phone number change to ensure it includes '+'
  const handlePhoneChange = (phone) => {
    if (!phone.startsWith("+")) {
      phone = "+" + phone;
    }
    setContactNumber(phone);
  };

  return (
    <div className="px-6 py-8 bg-white rounded-lg border border-gray-200 shadow-sm font-sans">
      <label className="block text-base font-light text-gray-600 mb-4">
        Contact details?
      </label>
      <label className="block text-sm font-thin text-gray-600 mb-2">
        Contact name (this name will appear to clients)
      </label>
      <input
        type="text"
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
        onFocus={() => handleFocus("contactName")}
        onBlur={() => handleBlur("contactName", contactName)}
        className={`p-2 border outline-none rounded-md lg:w-3/4 w-full font-thin text-sm shadow-sm ${
          errors.contactName ? "border-red-500" : ""
        }`}
        placeholder="Contact name (this name will appear to clients)"
      />
      {errors.contactName && (
        <div
          className="text-red-500 text-xs flex items-center
      gap-1 mt-1"
        >
          <BiErrorAlt />{" "}
          <p className="text-xs font-thin text-red-500">{errors.contactName}</p>
        </div>
      )}

      <label className="block text-sm font-thin mt-4 text-gray-600 mb-2">
        Contact number (so we can assist with your registration when needed)
      </label>
      <PhoneInput
        country={"us"}
        value={contactNumber}
        onChange={handlePhoneChange}
        inputProps={{
          name: "contactNumber",
          onFocus: () => handleFocus("contactNumber"),
          onBlur: () => handleBlur("contactNumber", contactNumber),
        }}
        style={{ width: "75%" }}
        inputStyle={{ width: "100%", border: "none" }}
        containerClass={`border rounded-md lg:w-3/4 w-full font-thin text-sm shadow-sm ${
          errors.contactNumber ? "border-red-500" : ""
        }`}
        inputClass={`${errors.contactNumber ? "border-red-500" : ""}`}
        specialLabel=""
        placeholder="+1 (555) 555-5555"
      />
      {errors.contactNumber && (
        <div
          className="text-red-500 text-xs flex items-center
             gap-1 mt-1"
        >
          <BiErrorAlt />{" "}
          <p className="text-xs font-thin text-red-500">
            {errors.contactNumber}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactDetailsForm;
