import React, { useState, useEffect } from "react";
import Footer from "../../../../components/Footers/FooterForLoggedIn";
import Header from "../../../../components/Headers/HeaderForAdminPanel";
import NavigationBar from "../../../../components/NavigationBarForContent";
import BasicInfoForm from "./BasicInformationForm";
import AirlineForm from "./AirlineForm";
import TransportForm from "./TransportForm";
import ZiyarahForm from "./ZiyarahForm";
import MakkahHotelForm from "./MakkahHotelForm";
import MadinaHotelForm from "./MadinaHotelForm";
import { resetFormAndTab } from "../../../../utility/formUtils"; // Import the utility function

const tabLabels = [
  "Basic Information",
  "Airline",
  "Transport",
  "Ziyarah",
  "Makkah Hotel",
  "Madina Hotel",
];

const CreatePackagePage = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("activeTab");
    return savedTab ? JSON.parse(savedTab) : 0;
  });

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    return savedData ? JSON.parse(savedData) : {};
  });

  const [completedTabs, setCompletedTabs] = useState(() => {
    const savedTabs = localStorage.getItem("completedTabs");
    return savedTabs ? new Set(JSON.parse(savedTabs)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem("activeTab", JSON.stringify(activeTab));
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem(
      "completedTabs",
      JSON.stringify(Array.from(completedTabs))
    );
  }, [completedTabs]);

  useEffect(() => {
    const handlePopState = () => {
      resetFormAndTab();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleFormDataChange = (data) => {
    setFormData({ ...formData, [tabLabels[activeTab]]: data });
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleNextTab = (updatedData) => {
    setFormData({ ...formData, [tabLabels[activeTab]]: updatedData });
    const nextTab = activeTab + 1;
    if (nextTab < tabLabels.length) {
      setCompletedTabs((prev) => new Set(prev).add(activeTab));
      setActiveTab(nextTab);
    }
  };

  const renderTabContent = () => {
    const isEditing = completedTabs.has(activeTab);
    switch (activeTab) {
      case 0:
        return (
          <BasicInfoForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
            isEditing={isEditing}
          />
        );
      case 1:
        return (
          <AirlineForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
            isEditing={isEditing}
          />
        );
      case 2:
        return (
          <TransportForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
            isEditing={isEditing}
          />
        );
      case 3:
        return (
          <ZiyarahForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
            isEditing={isEditing}
          />
        );
      case 4:
        return (
          <MakkahHotelForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
            isEditing={isEditing}
          />
        );
      case 5:
        return (
          <MadinaHotelForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
            resetFormAndTab={resetFormAndTab}
            isEditing={isEditing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f6f6] font-sans">
      <Header />
      <NavigationBar />
      <div className="w-[85%] mx-auto mt-7 mb-10 flex-grow">
        <h3 className="text-lg font-medium mb-2 text-gray-600">
          Package Enrollment
        </h3>
        <p className="text-sm font-thin text-gray-600 mb-4">
          Start by telling us the detail of your package according to the
          following fields and ensure to enter the correct detail.
        </p>
        <div
          className="w-full mt-6 flex overflow-x-auto no-scrollbar mb-4 space-x-1"
          style={{ scrollbarWidth: "none" }} // For Firefox
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
              disabled={index > activeTab && !completedTabs.has(index)}
              className={`py-2 w-full px-4 md:px-0 lg:px-4 sm:py-4 text-xs lg:text-sm relative focus:outline-none ${
                activeTab === index
                  ? "text-gray-600 bg-[#E6F4F0]"
                  : completedTabs.has(index)
                  ? "text-[#00936C] font-medium"
                  : index > activeTab
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 font-thin"
              }`}
              style={{
                fontSize: "clamp(10px, 1.5vw, 12px)",
                whiteSpace: "nowrap",
              }}
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

        <div className="w-[85%] lg:w-full mx-auto font-sans mt-5"></div>
        <div className="w-full mx-auto">{renderTabContent()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePackagePage;
