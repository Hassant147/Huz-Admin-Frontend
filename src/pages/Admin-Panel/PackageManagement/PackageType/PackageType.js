import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Packagetype.css";
import AdminPanelLayout from "../../../../components/layout/AdminPanelLayout";
import { resetFormAndTab } from "../../../../utility/formUtils"; // Import the utility function
import { BiErrorAlt } from "react-icons/bi";

const PackageType = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedService, setSelectedService] = useState("");
  const [error, setError] = useState("");
  const [partnerType, setPartnerType] = useState("");

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
    if (profile && profile.partner_type) {
      setPartnerType(profile.partner_type);
    }
  }, []);

  const handleRadioChange = (event) => {
    const { value } = event.target;
    setSelectedService(value);
  };

  const handleContinue = () => {
    if (!selectedService) {
      setError("Please select one service.");
      return;
    }

    if (selectedService === "hajj" || selectedService === "umrah") {
      localStorage.setItem("selectedService", "hajjOrUmrah");
      localStorage.setItem(
        "package_type",
        selectedService === "hajj" ? "Hajj" : "Umrah"
      );
      resetFormAndTab(); // Call the utility function to reset form and tab state
      navigate("/company/package-creation");
    }
  };

  return (
    <AdminPanelLayout
      title="Package Enrollment"
      subtitle="Choose the package type you want to enroll."
      mainClassName="py-5 bg-[#f6f6f6]"
    >
      <main className="my-5">
        <div className="">
          <h3 className="text-lg font-medium mb-2 text-gray-600">
            Package Enrollment
          </h3>
          <p className="text-sm font-thin text-gray-600 mb-4">
            Start to enroll your package by the selection of your package type
            in the followings.{" "}
          </p>

          {location.state?.unsupportedPackageType === "transport" ? (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Transport-only package enrollment is no longer supported. Add transport inside a Hajj or Umrah package instead.
            </div>
          ) : null}

          <div className="flex flex-col mb-4 text-sm font-normal text-gray-500 lg:w-[455px]">
            {partnerType === "Company" && (
              <>
                <label
                  key="hajj"
                  className="mb-2 flex items-center border bg-white rounded-md p-3 custom-checkbox"
                >
                  <input
                    type="radio"
                    name="service"
                    value="hajj"
                    checked={selectedService === "hajj"}
                    onChange={handleRadioChange}
                    className="hidden"
                  />
                  <span className="checkmark"></span>
                  Hajj Packages
                </label>
                <label
                  key="umrah"
                  className="mb-2 flex items-center border bg-white rounded-md p-3 custom-checkbox"
                >
                  <input
                    type="radio"
                    name="service"
                    value="umrah"
                    checked={selectedService === "umrah"}
                    onChange={handleRadioChange}
                    className="hidden"
                  />
                  <span className="checkmark"></span>
                  Umrah Packages
                </label>
              </>
            )}
          </div>

          {error && (
            <div
              className="text-red-500 text-xs flex items-center
                gap-1 mt-1 mb-4"
            >
              <BiErrorAlt /> <p className="text-xs text-red-500">{error}</p>{" "}
            </div>
          )}

          <button
            onClick={handleContinue}
            className="w-full lg:w-auto px-10 py-2 bg-[#00936C] text-white rounded-md hover:bg-green-900"
          >
            Continue
          </button>
        </div>
      </main>
    </AdminPanelLayout>
  );
};

export default PackageType;
