import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import bgimg from "../../assets/bgImage.png";
import HeaderForSignup from "../../components/Headers/HeaderforSingup";
import FooterForSignup from "../../components/Footers/FooterForSingup";
import FormInput from "../../components/FormInput";
import Loader from "../../components/loader"; // Import the Loader component
import { checkUserExistence } from "../../utility/AuthApis";
import { NavigationContext } from "../../App"; // Import NavigationContext
import { BiErrorAlt } from "react-icons/bi";
import useUserLocation from "../../utility/useUserLocation"; // Import the custom hook

const EmailSignupPage = () => {
  const navigate = useNavigate();
  const { setIsEmailSignupVisited } = useContext(NavigationContext);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    apiError: "",
  });
  const [loading, setLoading] = useState(false);
  const countryCode = useUserLocation(); // Use the custom hook

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handlePhoneNumberChange = (value) => {
    setFormData({ ...formData, phoneNumber: `+${value}` });
    setErrors({ ...errors, phoneNumber: "" });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors({
      email: "",
      fullName: "",
      phoneNumber: "",
      apiError: "",
    });

    if (!formData.email || !validateEmail(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address.",
      }));
      return;
    }

    if (!formData.fullName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName: "Please enter your full name.",
      }));
      return;
    }

    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Please enter a valid phone number.",
      }));
      return;
    }

    localStorage.setItem("registerFormInput", JSON.stringify(formData));

    setLoading(true);

    try {
      const response = await checkUserExistence(formData.email);
      if (response.message === "User does not exist.") {
        setIsEmailSignupVisited(true);
        navigate("/signup/password");
      } else if (response.is_email_verified === false) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          apiError: "This Email address is already associated with another account.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          apiError: "This Email address is already associated with another account.",
        }));
      }
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apiError: "An error occurred. Please try again later.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen font-sans"
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Fixed Header */}
      <div className="sticky top-0 z-10">
        <HeaderForSignup />
      </div>

      {/* Content between Header and Footer */}
      <main className="flex-grow flex justify-center items-center py-8 overflow-y-auto p-4">
        <div className="w-full max-w-md py-12 px-6 bg-white rounded-lg shadow-custom-shadow">
          <h2 className="text-base font-medium mb-1 text-gray-600 text-start">
            Sign up with Email
          </h2>

          <FormInput
            label={
              <span>
                Email Address{" "}
                <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
                  *
                </span>
              </span>
            }
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            error={errors.email}
          />

          <FormInput
            label={
              <span>
                Full Name{" "}
                <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
                  *
                </span>
              </span>
            }
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your name"
            error={errors.fullName}
          />

          <div className="mb-3">
            <label htmlFor="phoneNumber" className="block text-[#4B465C] font-thin text-xs mb-1">
              Phone Number{" "}
              <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
                *
              </span>
            </label>
            <PhoneInput
              country={countryCode}
              value={formData.phoneNumber}
              onChange={handlePhoneNumberChange}
              inputStyle={{
                width: "100%",
                outline: "none",
                border: "none",
                fontSize: "0.875rem",
              }}
              containerClass={`mb-3 w-full border rounded-md ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              dropdownClass="custom-dropdown"
            />
            {errors.phoneNumber && (
              <div className="text-red-500 text-xs flex items-center gap-1">
                <BiErrorAlt />
                <span>{errors.phoneNumber}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className={`w-full text-sm p-2 mb-3 bg-[#00936C] text-white rounded-md hover:bg-green-900 flex items-center justify-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            Continue
            {loading && <Loader />}
          </button>

          {errors.apiError && (
            <div className="text-red-500 text-xs flex items-center gap-1">
              <BiErrorAlt />
              <span>{errors.apiError}</span>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Footer */}
      <FooterForSignup />
    </div>
  );
};

export default EmailSignupPage;
