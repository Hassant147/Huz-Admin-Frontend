import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import bgimg from "../../assets/bgImage.png";
import FooterForSignup from "../../components/Footers/FooterForSingup";
import Loader from '../../components/loader';  // Import the Loader component
import { BiErrorAlt } from "react-icons/bi";
import { checkUserExistence } from "../../utility/Super-Admin-Api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState();
  const [errors, setErrors] = useState({
    phoneNumber: "",
  });
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({ phoneNumber: "" });
    setApiError("");
    setIsLoading(true);

    if (!value) {
      setErrors({
        phoneNumber: "Phone number is required",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { status, data } = await checkUserExistence(value);

      if (status === 200 && data.user_type === "admin") {
        // Store the entire user data in local storage
        localStorage.setItem('user-data', JSON.stringify(data));
        
        // Set the isSuperAdmin flag if the user is a super admin
        localStorage.setItem("isSuperAdmin", true);

        // Redirect to the super admin dashboard
        navigate("/super-admin-dashboard");
      } else if (status === 200 && data.user_type !== "admin") {
        setApiError("User is not an admin.");
      } else if (status === 404) {
        setApiError("User does not exist.");
      }
    } catch (error) {
      setApiError("An error occurred while checking the user.");
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
      <main className="flex-grow flex justify-center items-center p-4">
        <div className="w-full max-w-md py-12 px-6 bg-white rounded-lg shadow-custom-shadow md:mx-auto">
          <h2 className="text-base font-medium mb-1 text-gray-600 text-center">
            Log in to your account
          </h2>

          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <PhoneInput
              placeholder="Enter phone number"
              value={value}
              onChange={setValue}
              defaultCountry="US"
              className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
            />
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-red-600">
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {apiError && (
            <div
              className="text-red-500 text-xs flex items-center
                            gap-1 mt-1 mb-4"
            >
              <BiErrorAlt />
              <div className="text-red-600 text-sm">{apiError}</div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className={`w-full text-sm p-2 mb-3 bg-[#00936C] text-white rounded-md hover:bg-green-900 flex items-center justify-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Continue"}
          </button>
        </div>
      </main>

      <FooterForSignup />
    </div>
  );
};

export default LoginPage;
