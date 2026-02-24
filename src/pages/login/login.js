import React, { useState } from "react";
import { BiErrorAlt } from "react-icons/bi";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useNavigate } from "react-router-dom";
import FooterForSignup from "../../components/Footers/FooterForSingup";
import Loader from "../../components/loader";
import { AppButton, AppContainer } from "../../components/ui";
import bgimg from "../../assets/bgImage.png";
import { checkUserExistence } from "../../utility/Super-Admin-Api";
import {
  getPakistanLocalDigits,
  getPakistanPhoneInputState,
  validatePhoneNumberForLogin,
} from "../../utility/phoneValidation";

const LoginPage = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState({ phoneNumber: "" });
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({ phoneNumber: "" });
    setApiError("");
    setIsLoading(true);

    const phoneValidation = validatePhoneNumberForLogin(value);

    if (!phoneValidation.isValid) {
      setErrors({ phoneNumber: phoneValidation.error });
      setIsLoading(false);
      return;
    }

    try {
      const { status, data } = await checkUserExistence(phoneValidation.normalizedPhoneNumber);

      if (status === 200 && data.user_type === "admin") {
        localStorage.setItem("user-data", JSON.stringify(data));
        localStorage.setItem("isSuperAdmin", true);
        navigate("/super-admin-dashboard");
        return;
      }

      if (status === 200 && data.user_type !== "admin") {
        setApiError("This account is not authorized for admin access.");
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
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.88), rgba(244,247,247,0.92)), url(${bgimg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <main className="flex-grow flex items-center py-8">
        <AppContainer>
          <div className="max-w-md mx-auto app-card px-6 py-10 md:px-8">
            <h2 className="text-xl font-semibold text-ink-900 text-center">Admin sign in</h2>
            <p className="mt-2 mb-6 text-sm text-ink-500 text-center">
              Continue with your registered admin phone number.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-ink-700 mb-1.5">
                  Phone Number
                </label>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={value}
                  onChange={(phoneNumberValue) => {
                    const phoneInputState = getPakistanPhoneInputState(phoneNumberValue || "");

                    if (!phoneInputState.isAllowed) {
                      setValue(phoneInputState.normalizedPhoneNumber || value || "");
                      setErrors({ phoneNumber: phoneInputState.error });
                      return;
                    }

                    setValue(phoneInputState.normalizedPhoneNumber);
                    if (errors.phoneNumber || apiError) {
                      setErrors({ phoneNumber: "" });
                      setApiError("");
                    }
                  }}
                  defaultCountry="PK"
                  country="PK"
                  international={false}
                  countryCallingCodeEditable={false}
                  numberInputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    onKeyDown: (event) => {
                      const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];

                      if (allowedKeys.includes(event.key)) {
                        return;
                      }

                      if (!/^\d$/.test(event.key)) {
                        event.preventDefault();
                        return;
                      }

                      const localDigits = getPakistanLocalDigits(value);

                      if (localDigits.length === 0 && event.key === "0") {
                        event.preventDefault();
                        setErrors({ phoneNumber: "Do not start number with 0 after +92" });
                        return;
                      }

                      if (localDigits.length >= 10) {
                        event.preventDefault();
                        setErrors({ phoneNumber: "Pakistan mobile number cannot exceed 10 digits" });
                      }
                    },
                  }}
                  className={`mt-1 block w-full ${errors.phoneNumber ? "border-red-500" : ""}`}
                />
                {errors.phoneNumber ? <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p> : null}
              </div>

              {apiError ? (
                <div className="text-red-500 text-sm flex items-center gap-1 mt-1 mb-4">
                  <BiErrorAlt />
                  <span>{apiError}</span>
                </div>
              ) : null}

              <AppButton
                type="submit"
                className={`w-full ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : "Continue"}
              </AppButton>
            </form>
          </div>
        </AppContainer>
      </main>

      <FooterForSignup />
    </div>
  );
};

export default LoginPage;
