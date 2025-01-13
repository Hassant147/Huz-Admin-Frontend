import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updatePartnerServices } from "../../utility/AuthApis";
import HeaderForSignup from "../../components/Headers/HeaderForLoggedIn";
import Footer from "../../components/Footers/FooterForLoggedIn";
import bgimg from "../../assets/bgImage.png";
import icon from "../../assets/iconForServiceSelection.svg";
import Loader from "../../components/loader";
import { BiErrorAlt } from "react-icons/bi";

const ServiceSelectionPage = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState({
    hajj: false,
    umrah: false,
    ziyarah: false,
    transport: false,
    visa: false,
  });
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fullNameFromLocalStorage = localStorage.getItem("registerFormInput");
    if (fullNameFromLocalStorage) {
      const fullNameData = JSON.parse(fullNameFromLocalStorage);
      setFullName(fullNameData.fullName);
    }
  }, []);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setServices({ ...services, [name]: checked });
  };

  const isAnyServiceSelected = () => {
    return Object.values(services).some((value) => value === true);
  };

  const handleContinue = async () => {
    if (!isAnyServiceSelected()) {
      setError("Please select at least one service.");
      return;
    }

    let partnerType = "";
    if (
      services.transport &&
      (services.hajj || services.umrah || services.ziyarah || services.visa)
    ) {
      partnerType = "Company";
    } else if (services.transport) {
      partnerType = "Individual";
    } else {
      partnerType = "Company";
    }

    localStorage.setItem("selectedServices", JSON.stringify(services));
    localStorage.setItem("partnerType", partnerType);

    const { partner_session_token } = JSON.parse(
      localStorage.getItem("SignedUp-User-Profile")
    );

    const data = {
      partner_session_token,
      is_hajj_service_offer: services.hajj,
      is_umrah_service_offer: services.umrah,
      is_ziyarah_service_offer: services.ziyarah,
      is_transport_service_offer: services.transport,
      is_visa_service_offer: services.visa,
    };

    setIsLoading(true);

    try {
      const response = await updatePartnerServices(data);
      localStorage.setItem("SignedUp-User-Profile", JSON.stringify(response));
      if (partnerType === "Individual") {
        navigate("/individual-registration");
      } else {
        navigate("/company-registration");
      }
    } catch (error) {
      console.error("Error updating partner services:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    window.open('/documentation', '_blank');
  };

  return (
    <div className="font-sans bg-[#f6f6f6] min-h-screen flex flex-col">
      <HeaderForSignup />
      <main className="mt-16 flex-grow mb-8">
        <div className="w-[85%] lg:w-[80%] rounded-lg shadow-custom-shadow flex flex-col lg:flex-row mx-auto">
          {/* Left Section */}
          <div
            className="lg:w-1/2 flex w-full items-center lg:justify-center bg-[#E6F4F0] bg-cover bg-center"
            style={{
              backgroundImage: `url(${bgimg})`,
            }}
          >
            <div className="lg:w-3/4 text-start p-5">
              <h2 className="text-xl lg:text-2xl font-medium mb-4 text-gray-600">
                Welcome {fullName}!
              </h2>
              <p className="text-sm text-gray-600 mb-4 font-thin">
                <span className="font-semibold">Need Help?</span> Check out the
                documentation of Huz. It is a long-established fact that a
                reader will be distracted by the readable content of a page when
                looking at its layout.
              </p>
              <div className="flex md:justify-start justify-center">
                <button
                  className="p-2 mb-3 w-full md:w-auto bg-[#616065] text-white rounded-md flex items-center justify-center gap-2"
                  onClick={handleClick}
                >
                  <img
                    src={icon} // Replace with actual path to your icon image
                    alt="Documentation"
                    className="w-4 h-4"
                  />
                  <span>Check Documentation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:w-1/2 py-10 px-5 lg:py-20 lg:px-10">
            <h3 className="text-lg font-normal mb-2 text-gray-600">
              What services do you offer?
            </h3>
            <p className="text-sm font-thin text-gray-600 mb-4">
              Please specify the services you are capable of providing to
              pilgrims in detail.
            </p>

            {/* Service Checkboxes */}
            <div className="flex flex-col mb-4 text-sm font-thin text-gray-500">
              {[
                { label: "Hajj Packages", name: "hajj" },
                { label: "Umrah Packages", name: "umrah" },
                // { label: 'Ziyarah Packages', name: 'ziyarah' },
                { label: "Transport Packages", name: "transport" },
                // { label: "Visa Services", name: "visa" },
              ].map(({ label, name }) => (
                <label key={name} className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    name={name}
                    checked={services[name]}
                    onChange={handleCheckboxChange}
                    className="mr-2 border-gray-400"
                  />
                  {label}
                </label>
              ))}
            </div>

            {error && (
              <div
                className="text-red-500 flex my-3 items-center
               gap-1 "
              >
                <BiErrorAlt /> <p className="text-xs text-red-500">{error}</p>
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full md:w-auto px-10 py-2 bg-[#00936C] text-white rounded-md hover:bg-green-900 flex items-center justify-center"
              disabled={isLoading}
            >
              Continue
              {isLoading && <Loader />}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceSelectionPage;