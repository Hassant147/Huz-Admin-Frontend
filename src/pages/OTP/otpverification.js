import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/otpIcon.svg";
import bgimg from "../../assets/bgImage.png";
import HeaderForSignup from "../../components/Headers/HeaderForLoggedIn";
import Loader from "../../components/loader";
import { verifyOtp, resendOtp } from "../../utility/AuthApis";
import { BiErrorAlt } from "react-icons/bi";

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const inputRefs = useRef(otp.map(() => React.createRef()));
  const navigate = useNavigate();

  const signedUpUserProfile = JSON.parse(
    localStorage.getItem("SignedUp-User-Profile")
  );
  const userEmail = signedUpUserProfile.email;

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.substr(value.length - 1, 1);
    setOtp(newOtp);

    if (value.length > 0 && index < otp.length - 1) {
      inputRefs.current[index + 1].current.focus();
    }

    if (value === "" && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = pasteData.split("").map((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].current.value = char;
        if (index < otp.length - 1) {
          inputRefs.current[index + 1].current.focus();
        }
      }
      return char;
    });
    setOtp(newOtp);
  };

  const handleOtpSubmit = async () => {
    const enteredOtp = otp.join("");
    setIsLoading(true);
    setErrors(""); // Clear errors

    const { partner_session_token } = signedUpUserProfile;

    const data = {
      partner_session_token,
      otp: enteredOtp,
    };

    try {
      const response = await verifyOtp(data);
      localStorage.setItem("SignedUp-User-Profile", JSON.stringify(response));
      navigate("/service-selection");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrors("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setErrors(""); // Clear errors

    const { partner_session_token } = signedUpUserProfile;

    const data = {
      partner_session_token,
    };

    try {
      await resendOtp(data);
    } catch (error) {
      console.error("Error resending OTP:", error);
      setErrors("Failed to resend OTP. Please try again later.");
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
        <div className="w-full max-w-md py-10 px-6 bg-white rounded-lg shadow-custom-shadow text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[#f2f2f2] rounded-full p-2">
              <img
                src={img}
                alt="Verification"
                style={{ width: "98px", height: "98px" }}
              />
            </div>
          </div>
          <h2 className="text-lg font-medium mb-1 text-gray-600">
            Verify your email to proceed
          </h2>
          <p className="mb-6 text-sm font-thin text-gray-500">
            We sent a verification code to{" "}
            <span className="font-semibold">{userEmail}</span>
            <br />
            Enter the code from the email in the field below.
          </p>

          <div className="flex justify-between mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                id={`otp-input-${index}`}
                ref={inputRefs.current[index]}
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onFocus={(e) => e.target.select()}
                className="w-12 p-3 border rounded-md text-center text-sm"
              />
            ))}
          </div>

          {errors && (
            <div
              className="text-red-500 flex my-3 items-center
               gap-1 "
            >
              <BiErrorAlt />{" "}
              <span className="text-red-500 text-xs">{errors}</span>
            </div>
          )}

          <button
            onClick={handleOtpSubmit}
            className={`w-full text-sm p-2 mb-3 bg-[#00936C] text-white rounded-md hover:bg-green-900 flex items-center justify-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            Continue
            {isLoading && <Loader />} {/* Add Loader here */}
          </button>

          <p className="text-sm text-gray-500">
            Did not receive email?{" "}
            <a
              href="#"
              className="text-green-700 underline"
              onClick={handleResendOtp}
            >
              Resend
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default OtpVerificationPage;
