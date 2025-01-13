import React, { useState, useEffect } from "react";
import { updateIndividualProfile } from "../../../utility/Api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { BiErrorAlt } from "react-icons/bi";

const IndividualDetail = () => {
  const [formData, setFormData] = useState({
    contactName: "",
    contactNumber: "",
  });
  const [initialData, setInitialData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
    if (profile) {
      const initialProfileData = {
        contactName: profile.type_and_detail.contact_name || "",
        contactNumber: profile.type_and_detail.contact_number || "",
      };
      setFormData(initialProfileData);
      setInitialData(initialProfileData);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      contactNumber: value,
    });
  };

  const handleValidation = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (!formData[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "This field is required",
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
      const updatedProfile = await updateIndividualProfile(
        formData,
        partner_session_token
      );

      // Save updated profile in localStorage
      localStorage.setItem(
        "SignedUp-User-Profile",
        JSON.stringify(updatedProfile)
      );

      // Update formData and initialData with the new profile data
      const newProfileData = {
        contactName: updatedProfile.type_and_detail.contact_name || "",
        contactNumber: updatedProfile.type_and_detail.contact_number || "",
      };
      setFormData(newProfileData);
      setInitialData(newProfileData);

      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      setFormData(initialData);
      alert("Failed to update profile. Reverting to previous values.");
    }
    setSubmitLoading(false);
  };

  return (
    <div className="lg:w-[85%]">
      <form onSubmit={handleSubmit} className="mx-auto ">
        <div className="p-6 bg-white rounded-md shadow-md">
          <div className="mb-4 lg:w-3/4">
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
              onChange={handleChange}
              onBlur={handleBlur}
              className="p-2 outline-none border rounded-md w-[75%] font-thin text-sm shadow-sm"
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
          <div className="mb-4 lg:w-3/4">
            <label
              className="block text-gray-700 text-xs font-light mb-2"
              htmlFor="contactNumber"
            >
              Contact number (so we can assist with your registration when
              needed)
            </label>
            <PhoneInput
              country={"us"}
              value={formData.contactNumber}
              onChange={handlePhoneChange}
              onBlur={handleBlur}
              containerStyle={{ width: "75%" }}
              inputStyle={{
                width: "100%",
                padding: "5px 5px 5px 45px",
                border: `1px solid ${
                  errors.contactNumber ? "#f00" : "#ced4da"
                }`,
                borderRadius: "4px",
                boxShadow: "none",
              }}
              inputProps={{
                name: "contactNumber",
                required: true,
                className:
                  "border outline-none rounded-md w-full font-thin text-sm shadow-sm",
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
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
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
    </div>
  );
};

export default IndividualDetail;
