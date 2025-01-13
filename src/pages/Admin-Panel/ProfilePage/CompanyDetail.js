import React, { useState, useEffect } from "react";
import { updateCompanyProfile } from "../../../utility/Api";
import { checkUserNameForPartner } from "../../../utility/AuthApis";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { BiErrorAlt } from "react-icons/bi";
import Select from "react-select";

const CompanyDetail = () => {
  const [formData, setFormData] = useState({
    username: "",
    contactName: "",
    contactNumber: "",
    countryCode: "",
    companyWebsite: "",
    totalExperience: "",
    companyBio: "",
  });
  const [initialData, setInitialData] = useState({});
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const experienceOptions = [
    { value: "1", label: "1 year" },
    { value: "2", label: "2 years" },
    { value: "3", label: "3 years" },
    { value: "4", label: "4 years" },
    { value: "5", label: "5 years" },
    { value: "6", label: "6 years" },
    { value: "7", label: "7 years" },
    { value: "8", label: "8 years" },
    { value: "9", label: "9 years" },
    { value: "10", label: "10 years" },
    { value: "11", label: "11 years" },
    { value: "12", label: "12 years" },
    { value: "13", label: "13 years" },
    { value: "14", label: "14 years" },
    { value: "15", label: "15 years" },
    { value: "16", label: "16 years" },
    { value: "17", label: "17 years" },
    { value: "18", label: "18 years" },
    { value: "19", label: "19 years" },
    { value: "20", label: "20 years" },
  ];

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
    if (profile) {
      const initialProfileData = {
        username: profile.user_name || "",
        contactName: profile.partner_type_and_detail.contact_name || "",
        contactNumber: profile.partner_type_and_detail.contact_number || "",
        countryCode: profile.country_code || "",
        companyWebsite: profile.partner_type_and_detail.company_website || "",
        totalExperience: profile.partner_type_and_detail.total_experience || "",
        companyBio: profile.partner_type_and_detail.company_bio || "",
      };
      setFormData(initialProfileData);
      setInitialData(initialProfileData);
    }
  }, [setFormData]);

  const handleChange = (field, value) => {
    if (field === "contactNumber" && !value.startsWith("+")) {
      value = `+${value}`;
    }
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, totalExperience: selectedOption.value });
  };

  const validateWebsite = (website) => {
    const regex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)?$/;
    return regex.test(website);
  };

  const validatePhoneNumber = (number) => {
    const regex = /^\+?[1-9]\d{1,14}$/; // Adjusted regex to handle international phone numbers with country codes
    return regex.test(number);
  };

  const handleValidation = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        key !== "companyWebsite" &&
        key !== "totalExperience" &&
        key !== "contactNumber" &&
        !formData[key]
      ) {
        newErrors[key] = "This field is required";
      }
      if (
        key === "companyWebsite" &&
        formData[key] &&
        !validateWebsite(formData[key])
      ) {
        newErrors[key] = "Invalid website format";
      }
      if (
        key === "contactNumber" &&
        formData[key] &&
        !validatePhoneNumber(formData[key])
      ) {
        newErrors[key] = "Invalid phone number format";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUsernameCheck = async () => {
    if (!formData.username) {
      setUsernameStatus({ available: false });
      return;
    }
    setLoading(true);
    try {
      const { partner_session_token } = JSON.parse(
        localStorage.getItem("SignedUp-User-Profile")
      );
      const result = await checkUserNameForPartner({
        user_name: formData.username,
        partner_session_token: partner_session_token,
      });
      if (result.exists) {
        setUsernameStatus({
          available: false,
          message: "Username is already taken",
        });
      } else {
        setUsernameStatus({
          available: true,
          message: "Username is available",
        });
      }
    } catch (error) {
      setUsernameStatus({
        available: false,
        message: "Error checking username",
      });
    }
    setLoading(false);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (
      name !== "companyWebsite" &&
      name !== "totalExperience" &&
      name !== "contactNumber" &&
      !formData[name]
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "This field is required",
      }));
    } else if (
      name === "companyWebsite" &&
      formData[name] &&
      !validateWebsite(formData[name])
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Invalid website format",
      }));
    } else if (
      name === "contactNumber" &&
      formData[name] &&
      !validatePhoneNumber(formData[name])
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Invalid phone number format",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    setSubmitLoading(true);
    try {
      const { partner_session_token } = JSON.parse(
        localStorage.getItem("SignedUp-User-Profile")
      );
      const updatedProfile = await updateCompanyProfile(
        formData,
        partner_session_token
      );

      localStorage.setItem(
        "SignedUp-User-Profile",
        JSON.stringify(updatedProfile)
      );

      const newProfileData = {
        username: updatedProfile.user_name || "",
        contactName: updatedProfile.partner_type_and_detail.contact_name || "",
        contactNumber: updatedProfile.partner_type_and_detail.contact_number || "",
        countryCode: updatedProfile.country_code || "",
        companyWebsite: updatedProfile.partner_type_and_detail.company_website || "",
        totalExperience: updatedProfile.partner_type_and_detail.total_experience || "",
        companyBio: updatedProfile.partner_type_and_detail.company_bio || "",
      };
      setFormData(newProfileData);
      setInitialData(newProfileData);

      alert("Profile updated successfully!");
      window.location.reload(); // Reload the webpage
    } catch (error) {
      setFormData(initialData);
      alert("Failed to update profile. Reverting to previous values.");
    }
    setSubmitLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="lg:w-[75%] mx-auto ">
      <div className="p-6 bg-white rounded-md shadow-md">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-xs font-light mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            onFocus={handleUsernameCheck}
            onBlur={(e) => {
              handleUsernameCheck();
              handleBlur(e);
            }}
            className="p-2 outline-none border rounded-md md:w-[435px] w-full font-thin text-sm shadow-sm"
          />
          {loading && (
            <p className="text-xs text-blue-600 mt-1">
              Checking username<span className="animate-pulse">...</span>
            </p>
          )}
          {usernameStatus && !loading && (
            <p
              className={`text-xs mt-1 ${
                usernameStatus.available ? "text-green-600" : "text-red-600"
              }`}
            >
              {usernameStatus.message}
            </p>
          )}
          {errors.username && (
            <div
              className="text-red-500 text-xs flex items-center
       gap-1 mt-1"
            >
              <BiErrorAlt />{" "}
              <p className="text-red-600 text-xs">{errors.username}</p>
            </div>
          )}
          <p className="text-gray-600 text-xs font-light mt-1">
            This username will help your clients to reach out easily to your
            profile.
          </p>
        </div>
        <div className="mb-4 md:w-[435px] w-full">
          <label
            className="block text-gray-700 text-xs font-light mb-2"
            htmlFor="contactName"
          >
            Contact name
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={(e) => handleChange("contactName", e.target.value)}
            onBlur={handleBlur}
            className="p-2 border outline-none rounded-md md:w-[435px] w-full font-thin text-sm shadow-sm"
          />
          {errors.contactName && (
            <div
              className="text-red-500 text-xs flex items-center
       gap-1 mt-1"
            >
              <BiErrorAlt />{" "}
              <p className="text-red-600 text-xs">{errors.contactName}</p>
            </div>
          )}
        </div>
        <div className="md:w-[435px]">
          <h1 className="block text-gray-700 text-xs font-light mb-2">
            Contact number (so we can assist with your registration when needed)
          </h1>
          <PhoneInput
            country={"pk"}
            value={formData.contactNumber}
            onChange={(value) => handleChange("contactNumber", value)}
            containerStyle={{ width: "100%" }}
            className="form-input text-[#4b465c] shadow-sm rounded w-full"
            inputStyle={{
              width: "100%",
              padding: "8px 8px 8px 50px",
              border: `1px solid ${errors.contactNumber ? "#f00" : "#ced4da"}`,
              borderRadius: "4px",
              fontSize: "13px",
            }}
          />
          {errors.contactNumber && (
            <div
              className="text-red-500 text-xs flex items-center
       gap-1 mt-1"
            >
              <BiErrorAlt />{" "}
              <p className="text-red-600 text-xs">{errors.contactNumber}</p>
            </div>
          )}
        </div>
        <div className="mb-4 md:w-[435px] w-full mt-4">
          <label
            className="block text-gray-700 text-xs font-light mb-2"
            htmlFor="companyWebsite"
          >
            Company website URL
          </label>
          <input
            type="text"
            id="companyWebsite"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={(e) => handleChange("companyWebsite", e.target.value)}
            onBlur={handleBlur}
            className="p-2 outline-none border rounded-md w-full font-thin text-sm shadow-sm"
          />
          {errors.companyWebsite && (
            <div
              className="text-red-500 text-xs flex items-center
       gap-1 mt-1"
            >
              <BiErrorAlt />{" "}
              <p className="text-red-600 text-xs">{errors.companyWebsite}</p>
            </div>
          )}
        </div>
        <div className="mb-4 md:w-[435px] w-full mt-4">
          <label
            className="block text-gray-700 text-xs font-light mb-2"
            htmlFor="totalExperience"
          >
            Total year of experience
          </label>
          <Select
            id="totalExperience"
            name="totalExperience"
            value={experienceOptions.find(
              (option) => option.value === formData.totalExperience
            )}
            onChange={handleSelectChange}
            options={experienceOptions}
            className=" outline-none rounded-md w-full font-thin text-sm shadow-sm"
          />
          {errors.totalExperience && (
            <div
              className="text-red-500 text-xs flex items-center
       gap-1 mt-1"
            >
              <BiErrorAlt />{" "}
              <p className="text-red-600 text-xs">{errors.totalExperience}</p>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-xs font-light mb-2"
            htmlFor="companyBio"
          >
            Company Bio
          </label>
          <textarea
            id="companyBio"
            name="companyBio"
            value={formData.companyBio}
            onChange={(e) => handleChange("companyBio", e.target.value)}
            onBlur={handleBlur}
            className="p-2 outline-none border resize-none rounded-md w-full h-[188px] font-thin text-sm shadow-sm"
            placeholder="Write about your company about us\n- Company Introduction\n- Year of Experience\n- Services detail "
          />
          {errors.companyBio && (
            <div
              className="text-red-500 text-xs flex items-center
       gap-1 mt-1"
            >
              <BiErrorAlt />{" "}
              <p className="text-red-600 text-xs">{errors.companyBio}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
          disabled={submitLoading}
        >
          {submitLoading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          Update Company Profile
        </button>
      </div>
    </form>
  );
};

export default CompanyDetail;
