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

const tabLabels = [
  "Basic Information",
  "Airline",
  "Transport",
  "Ziyarah",
  "Makkah Hotel",
  "Madina Hotel",
];

const ContinueCreatedCompanyForms = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({});
  const [completedTabs, setCompletedTabs] = useState(new Set());

  useEffect(() => {
    // Fetch package details and completed tabs from local storage
    const packageDetail = JSON.parse(localStorage.getItem("packageDetail"));
    const completedTabsFromStorage = new Set(
      JSON.parse(localStorage.getItem("completedTabs")) || []
    );

    // Update formData with packageDetail
    if (packageDetail) {
      setFormData({
        "Basic Information": packageDetail.company_details,
        Airline: packageDetail.airline_detail[0],
        Transport: packageDetail.transport_detail[0] || {},
        Ziyarah: packageDetail.ziyarah_detail[0] || {},
        "Makkah Hotel":
          packageDetail.hotel_detail.find(
            (hotel) => hotel.hotel_city.toLowerCase() === "mecca"
          ) || {},
        "Madina Hotel":
          packageDetail.hotel_detail.find(
            (hotel) => hotel.hotel_city.toLowerCase() === "madinah"
          ) || {},
      });
      localStorage.setItem("huz_token", packageDetail.huz_token);
    }

    // Update completedTabs state
    setCompletedTabs(completedTabsFromStorage);

    // Set the active tab to the first incomplete tab
    const firstIncompleteTab = tabLabels.findIndex(
      (label) => !completedTabsFromStorage.has(label)
    );
    if (firstIncompleteTab !== -1) {
      setActiveTab(firstIncompleteTab);
    }
  }, []);

  const handleFormDataChange = (data) => {
    setFormData({ ...formData, [tabLabels[activeTab]]: data });
  };

  const handleTabChange = (index) => {
    if (index === activeTab) {
      setActiveTab(index);
    }
  };

  const handleNextTab = () => {
    const nextTab = activeTab + 1;
    if (nextTab < tabLabels.length) {
      const newCompletedTabs = new Set(completedTabs).add(tabLabels[activeTab]);
      setCompletedTabs(newCompletedTabs);
      localStorage.setItem(
        "completedTabs",
        JSON.stringify([...newCompletedTabs])
      );
      setActiveTab(nextTab);
    }
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
          <AirlineForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
          />
        );
      case 2:
        return (
          <TransportForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
          />
        );
      case 3:
        return (
          <ZiyarahForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
          />
        );
      case 4:
        return (
          <MakkahHotelForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
          />
        );
      case 5:
        return (
          <MadinaHotelForm
            formData={formData[tabLabels[activeTab]]}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-[#f6f6f6] font-sans min-h-screen ">
      <Header />
      <NavigationBar />
      <div className="w-[85%] mx-auto lg:mt-14 mt-7 mb-10 flex-grow">
        <h3 className="text-lg font-medium mb-2 text-gray-600">
          Package Enrollment
        </h3>
        <p className="text-sm font-thin text-gray-600 mb-4">
          Start by telling us your package type by selecting one of the
          following:
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
          {tabLabels.map((label, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={label}
                onClick={() => handleTabChange(index)}
                disabled={!isActive}
                className={`py-2 w-full px-4 md:px-0 lg:px-4 sm:py-4 text-xs lg:text-sm relative focus:outline-none ${
                  isActive
                    ? "text-gray-600 bg-[#E6F4F0]"
                    : completedTabs.has(tabLabels[index])
                    ? "text-[#00936C] font-medium cursor-not-allowed"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                style={{
                  fontSize: "clamp(10px, 1.5vw, 12px)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
                <div
                  className={`absolute bottom-0 left-0 w-full h-[4px] ${
                    isActive
                      ? "bg-[#4B465C]"
                      : completedTabs.has(tabLabels[index])
                      ? "bg-[#00936C]"
                      : "bg-gray-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="w-[85%] lg:w-full mx-auto font-sans mt-10"></div>
        <div className="w-full mx-auto">{renderTabContent()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default ContinueCreatedCompanyForms;
