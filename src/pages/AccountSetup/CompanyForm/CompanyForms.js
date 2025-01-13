import React, { useState, useEffect } from "react";
import Footer from "../../../components/Footers/FooterForLoggedIn";
import HeaderForSignup from "../../../components/Headers/HeaderForLoggedIn";
import BasicInfoForm from "./BasicInfoForm";
import AddressForm from "./AdressDetail";
import RegistrationTaxForm from "./Registration&TaxInfo";
import CompanyOverviewForm from "./CompanyOverviewForm";
import UploadLogoForm from "./UploadLogoForm";
import { useNavigate } from "react-router-dom";

const tabLabels = [
  "Basic Information",
  "Address Detail",
  "Registration & Tax Info",
  "Company Overview",
  "Upload Logo",
];

const CompanyFormPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({});
  const [completedTabs, setCompletedTabs] = useState(new Set());

  useEffect(() => {
    const fullNameFromLocalStorage = localStorage.getItem("registerFormInput");
    if (fullNameFromLocalStorage) {
      const fullNameData = JSON.parse(fullNameFromLocalStorage);
      setFullName(fullNameData.fullName);
    }
  }, []);

  const handleFormDataChange = (data) => {
    setFormData({ ...formData, [tabLabels[activeTab]]: data });
  };

  const handleTabChange = (index) => {
    if (index <= activeTab) {
      setActiveTab(index);
    }
  };

  const handleNextTab = () => {
    const nextTab = activeTab + 1;
    if (nextTab < tabLabels.length) {
      setCompletedTabs((prev) => new Set(prev).add(activeTab));
      setActiveTab(nextTab);
    }
  };

  const handleFormSubmit = (responseData) => {
    navigate("/review");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <BasicInfoForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
          />
        );
      case 1:
        return (
          <AddressForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
          />
        );
      case 2:
        return (
          <RegistrationTaxForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
          />
        );
      case 3:
        return (
          <CompanyOverviewForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
          />
        );
      case 4:
        return (
          <UploadLogoForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onFormSubmit={handleFormSubmit}
            basicDetails={formData["Basic Information"]}
            addressDetails={formData["Address Detail"]}
            registrationTaxInfo={formData["Registration & Tax Info"]}
            companyOverview={formData["Company Overview"]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f6f6] font-sans">
      <HeaderForSignup />
      <div className="flex-grow flex flex-col">
        <div
          className="flex overflow-x-auto no-scrollbar md:justify-center mb-4 space-x-1"
          style={{ scrollbarWidth: "none" }}
        >
          <style jsx>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none; /* WebKit browsers */
            }
          `}</style>
          {tabLabels.map((label, index) => (
            <button
              key={label}
              onClick={() => handleTabChange(index)}
              disabled={index > activeTab}
              className={`py-4 px-4 sm:py-6 md:text-xs md:px-4 lg:px-8 xl:px-16 text-xs sm:text-sm relative focus:outline-none ${
                activeTab === index
                  ? "text-gray-600 bg-[#E6F4F0]"
                  : completedTabs.has(index)
                  ? "text-[#00936C] font-medium"
                  : index > activeTab
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 font-thin"
              }`}
              style={{ whiteSpace: "nowrap" }}
            >
              {label}
              <div
                className={`absolute bottom-0 left-0 w-full h-[4px] ${
                  activeTab === index
                    ? "bg-[#4B465C]"
                    : completedTabs.has(index)
                    ? "bg-[#00936C]"
                    : "bg-gray-400"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="w-full lg:w-[80%] xl:w-[85%] mx-auto mt-1 mb-10 flex-grow">
          <div className="w-[85%] lg:w-full mx-auto font-sans mt-10">
            <h2 className="text-2xl font-medium mb-1 text-[#4B465C]">{`Welcome ${fullName}!`}</h2>
            <h2 className="mb-4 text-sm font-thin text-gray-600">
              Start by telling us your company name, contact detail, address and
              incorporation detail.
            </h2>
          </div>
          <div className="lg:w-full w-[85%] mx-auto flex-grow">
            {renderTabContent()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyFormPage;
