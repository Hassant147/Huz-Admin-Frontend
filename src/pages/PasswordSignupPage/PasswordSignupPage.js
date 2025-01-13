import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgimg from "../../assets/bgImage.png";
import HeaderForSignup from "../../components/Headers/HeaderforSingup";
import FooterForSignup from "../../components/Footers/FooterForSingup";
import FormInput from "../../components/FormInput";
import Loader from "../../components/loader";
import { createPartnerProfile } from "../../utility/AuthApis";
import { NavigationContext } from "../../App"; // Correctly import the context
import { BiErrorAlt } from "react-icons/bi";

const PasswordSignupPage = () => {
  const navigate = useNavigate();
  const { isEmailSignupVisited } = useContext(NavigationContext);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    apiError: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const firebaseToken = localStorage.getItem('firebase_Token');

  useEffect(() => {
    if (!isEmailSignupVisited) {
      navigate("/signup/email");
    }
  }, [isEmailSignupVisited, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*<>?])[a-zA-Z\d!@#$%^&*<>?]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors({
      password: "",
      confirmPassword: "",
      apiError: "",
    });

    if (!formData.password || !validatePassword(formData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Passwords do not match.",
      }));
      return;
    }

    setIsLoading(true);

    const registerFormInput = JSON.parse(
      localStorage.getItem("registerFormInput")
    );
    const data = {
      sign_type: "Email",
      email: registerFormInput.email,
      name: registerFormInput.fullName,
      phone_number: registerFormInput.phoneNumber,
      password: formData.password,
      firebase_token: "",
      web_firebase_token: firebaseToken
    };

    try {
      const response = await createPartnerProfile(data, firebaseToken);
      localStorage.setItem("SignedUp-User-Profile", JSON.stringify(response));
      navigate("/otp-verification");
    } catch (error) {
      console.error("Error creating partner profile:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        apiError: "An error occurred. Please try again later.",
      }));
    } finally {
      setIsLoading(false);
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
      <div className="sticky top-0 z-10">
        <HeaderForSignup />
      </div>

      <main className="flex-grow flex justify-center items-center py-8 overflow-y-auto p-4">
        <div className="w-full max-w-md py-12 px-6 bg-white rounded-lg shadow-custom-shadow">
          <h2 className="text-base font-medium mb-1 text-gray-600 text-start">
            Create Password
          </h2>
          <h3 className="text-[10px] text-gray-400 text-start">
            Password must be 8 characters or longer, and contain at least one
            uppercase letter, one lowercase letter, one number, and one special character.
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <FormInput
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
            />
            <FormInput
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
            />

            {errors.apiError && (
              <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <BiErrorAlt />{" "}
                <p className="text-red-500 text-xs">{errors.apiError}</p>
              </div>
            )}

            <button
              type="submit"
              className={`w-full text-sm p-2 mb-3 bg-[#00936C] text-white rounded-md hover:bg-green-900 flex items-center justify-center ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              Continue
              {isLoading && <Loader />}
            </button>
          </form>
        </div>
      </main>
      <FooterForSignup />
    </div>
  );
};

export default PasswordSignupPage;
