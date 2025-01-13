import React, { useEffect, useState, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { checkUserNameForPartner } from "../../../utility/AuthApis"; // Import the API function
import { BiErrorAlt, BiCheckCircle } from "react-icons/bi";
import useUserLocation from "../../../utility/useUserLocation"; // Import the custom hook

const BasicInfoForm = ({ formData, onChange, onNextTab }) => {
  const { partner_session_token } = JSON.parse(
    localStorage.getItem("SignedUp-User-Profile")
  );

  const [companyName, setCompanyName] = useState(formData?.companyName || "");
  const [contactName, setContactName] = useState(formData?.contactName || "");
  const [contactNumber, setContactNumber] = useState(
    formData?.contactNumber || ""
  );
  const [websiteURL, setWebsiteURL] = useState(formData?.websiteURL || "");
  const [user_name, setUserName] = useState(formData?.user_name || "");
  const [errors, setErrors] = useState({
    companyName: "",
    contactName: "",
    contactNumber: "",
    websiteURL: "",
    user_name: "",
  });
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState("");
  const [actionSource, setActionSource] = useState(null); // New state to track the action source

  const companyNameRef = useRef(null);
  const contactNameRef = useRef(null);
  const contactNumberRef = useRef(null);
  const websiteURLRef = useRef(null);
  const userNameRef = useRef(null);

  const countryCode = useUserLocation(); // Use the custom hook

  useEffect(() => {
    localStorage.setItem("basicDetails", JSON.stringify(formData));
  }, [formData]);

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "companyName":
        if (!value.trim()) {
          error = "Company name is required";
        }
        break;
      case "contactName":
        if (!value.trim()) {
          error = "Contact name is required";
        }
        break;
      case "contactNumber":
        if (!value.trim()) {
          error = "Contact number is required";
        } else {
          const phoneNumberRegex = /^[+]?[0-9-]+$/;
          if (!phoneNumberRegex.test(value)) {
            error = "Invalid phone number";
          }
        }
        break;
      case "websiteURL":
        if (value.trim() && !isValidURL(value)) {
          error = "Invalid website URL";
        }
        break;
      case "user_name":
        if (!value.trim()) {
          error = "Username is required";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const isValidURL = (url) => {
    const urlRegex =
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return urlRegex.test(url);
  };

  const handleFieldChange = (field, value) => {
    const updatedData = {
      companyName,
      contactName,
      contactNumber,
      websiteURL,
      user_name,
      [field]: value,
    };

    switch (field) {
      case "companyName":
        setCompanyName(value);
        break;
      case "contactName":
        setContactName(value);
        break;
      case "contactNumber":
        setContactNumber(value);
        break;
      case "websiteURL":
        setWebsiteURL(value);
        break;
      case "user_name":
        setUserName(value);
        break;
      default:
        break;
    }

    const error = validateField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    onChange(updatedData);
  };

  const checkUsernameAvailability = async () => {
    if (!user_name.trim()) return;

    setIsCheckingUsername(true);
    setUsernameStatus("");
    try {
      const response = await checkUserNameForPartner({
        partner_session_token,
        user_name,
      });
      if (response.status === 200) {
        setUsernameStatus("Username is available");
        setErrors((prevErrors) => ({ ...prevErrors, user_name: "" }));
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setUsernameStatus("Username is already taken");
        setErrors((prevErrors) => ({
          ...prevErrors,
          user_name: "Username is already taken",
        }));
      } else {
        setUsernameStatus("Error checking username");
        setErrors((prevErrors) => ({
          ...prevErrors,
          user_name: "Error checking username",
        }));
      }
    }
    setIsCheckingUsername(false);
  };

  const handleBlur = async (field) => {
    setActionSource("blur"); // Set the action source to blur
    let error = validateField(field, eval(field));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    if (field === "user_name" && !error) {
      await checkUsernameAvailability();
    }
  };

  const handleContinue = () => {
    setActionSource("button"); // Set the action source to button
    const isValid = validate();
    if (
      isValid &&
      !errors.user_name &&
      usernameStatus !== "Username is already taken"
    ) {
      onNextTab();
      const basicDetails = JSON.parse(localStorage.getItem("basicDetails"));
    } else {
      [
        companyNameRef,
        contactNameRef,
        contactNumberRef,
        websiteURLRef,
        userNameRef,
      ].find((ref) => {
        if (ref.current && errors[ref.current.name]) {
          ref.current.focus();
          return true;
        }
        return false;
      });
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = {};

    [
      "companyName",
      "contactName",
      "contactNumber",
      "websiteURL",
      "user_name",
    ].forEach((field) => {
      newErrors[field] = validateField(field, eval(field));
      if (newErrors[field]) valid = false;
    });

    setErrors(newErrors);
    return valid;
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 font-sans">
      <div className="space-y-3 lg:w-3/4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div>
            <label htmlFor="phoneNumber" className="block text-base font-light text-gray-600 mb-2">
              What is the name of your company?{" "}
              <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
                *
              </span>
            </label>
            <input
              ref={companyNameRef}
              name="companyName"
              type="text"
              value={companyName}
              onChange={(e) => handleFieldChange("companyName", e.target.value)}
              onBlur={() => handleBlur("companyName")}
              className={`p-2 border outline-none rounded-md lg:w-3/4 w-full font-thin text-sm shadow-sm ${errors.companyName && "border-red-500"
                }`}
              placeholder="Enter company name"
            />
            <p className="text-xs text-[#4B465C] opacity-[80%] mt-1">
              This name will appear to clients when they search for a pilgrimage
              package.
            </p>

            {errors.companyName && (
              <div
                className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
              >
                <BiErrorAlt />{" "}
                <p className="text-xs font-thin text-red-500">
                  {errors.companyName}
                </p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="phoneNumber" className="block text-base font-light text-gray-600 mb-2">
              Set up a unique Username{" "}
              <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
                *
              </span>
            </label>
            <input
              ref={userNameRef}
              name="user_name"
              type="text"
              value={user_name}
              onChange={(e) => handleFieldChange("user_name", e.target.value)}
              onBlur={() => handleBlur("user_name")}
              className={`p-2 border outline-none rounded-md lg:w-3/4 w-full font-thin text-sm shadow-sm ${errors.user_name && "border-red-500"
                }`}
              placeholder="Enter username"
            />
            <button
              onClick={checkUsernameAvailability}
              className="mt-2 lg:ml-2 inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Check Username
            </button>
            <p className="text-xs text-[#4B465C] mt-1 opacity-[80%]">
              Create a unique username (URL) for your company profile to enhance
              visibility and connect with your audience.
            </p>

            {errors.user_name && (
              <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <BiErrorAlt />{" "}
                <p className="text-xs font-thin text-red-500">
                  {errors.user_name}
                </p>
              </div>
            )}
            {isCheckingUsername && (
              <p className="mt-2 text-xs font-thin text-gray-600">
                Checking username...
              </p>
            )}
            {usernameStatus && (
              <div className="flex items-center mt-1 gap-1">
                {usernameStatus === "Username is available" ? (
                  <>
                    <BiCheckCircle className="text-green-500" size={20} />
                    <p className="text-xs font-thin text-green-600">
                      {usernameStatus}
                    </p>
                  </>
                ) : (
                  actionSource === "button" && (
                    <>
                      <BiErrorAlt className="block text-red-500 text-sm" />
                      <p className="text-xs font-thin text-red-500">
                        {usernameStatus}
                      </p>
                    </>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h1 className="block text-base font-light text-gray-600 mb-2">
            What are your company's contact details?
          </h1>
          <label htmlFor="phoneNumber" className="block text-xs font-light text-gray-600 mb-2 mt-4">
            Contact name{" "}
            <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
              *
            </span>
          </label>
          <input
            ref={contactNameRef}
            name="contactName"
            type="text"
            placeholder="Contact name"
            value={contactName}
            onChange={(e) => handleFieldChange("contactName", e.target.value)}
            onBlur={() => handleBlur("contactName")}
            className={`p-2 border outline-none rounded-md lg:w-3/4 w-full font-thin text-sm shadow-sm ${errors.contactName && "border-red-500"
              }`}
          />
          {errors.contactName && (
            <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <BiErrorAlt />{" "}
              <p className="text-xs font-thin text-red-500">
                {errors.contactName}
              </p>
            </div>
          )}
          <label htmlFor="phoneNumber" className="block text-xs font-light text-gray-600 mb-2 mt-4">
            Contact number&nbsp;
            <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
              *&nbsp;
            </span>
            ( so we can assist with your registration when needed){" "}
          </label>
          <div className="w-full lg:w-3/4">
            <PhoneInput
              ref={contactNumberRef}
              name="contactNumber"
              country={countryCode}
              value={contactNumber}
              onChange={(value) => handleFieldChange("contactNumber", `+${value}`)}
              onBlur={() => handleBlur("contactNumber")}
              inputProps={{
                name: "phone",
                required: true,
                autoFocus: false,
              }}
              inputStyle={{
                width: "100%",
                padding: "8px 8px 8px 50px", // Padding: top right bottom left
                border: `1px solid ${errors.contactNumber ? "#f00" : "#ced4da"
                  }`,
                borderRadius: "4px",
                boxShadow: "none",
              }}
              containerStyle={{
                width: "100%",
              }}
            />
          </div>
          {errors.contactNumber && (
            <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <BiErrorAlt />{" "}
              <p className="text-xs font-thin text-red-500">
                {errors.contactNumber}
              </p>
            </div>
          )}
          <label className="block text-xs font-light text-gray-600 mb-2 mt-4">
            Company website URL (optional)
          </label>
          <input
            ref={websiteURLRef}
            name="websiteURL"
            type="url"
            placeholder="Company website URL"
            value={websiteURL}
            onChange={(e) => handleFieldChange("websiteURL", e.target.value)}
            onBlur={() => handleBlur("websiteURL")}
            className={`p-2 border outline-none rounded-md lg:w-3/4 w-full font-thin text-sm shadow-sm ${errors.websiteURL && "border-red-500"
              }`}
          />
          {errors.websiteURL && (
            <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <BiErrorAlt />{" "}
              <p className="text-xs font-thin text-red-500">
                {errors.websiteURL}
              </p>
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
      <div className="mt-4 lg:mt-0 lg:w-1/4 h-1/4 p-4 bg-[#E5F0EA] text-[#4B465C] rounded-lg shadow-sm border border-gray-200">
        <p className="block text-xs font-normal">
          Please ensure that the information you provide is accurate and
          carefully considered. HUZ Solutions will verify the data submitted
          during registration prior to listing your company on the platform.
        </p>
      </div>
    </div>
  );
};

export default BasicInfoForm;
