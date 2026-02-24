import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../../../../components/loader";

import AdminPanelLayout from "../../../../components/layout/AdminPanelLayout";

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

const EditPackagePage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({});
  const [completedTabs, setCompletedTabs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const isEditing = !!location.state?.packageDetail;

  const loadFormData = () => {
    const storedPackageDetail = localStorage.getItem("packageDetail");
    if (storedPackageDetail) {
      setFormData(JSON.parse(storedPackageDetail));
    }
    setLoading(false); // Data is loaded, set loading to false
  };

  useEffect(() => {
    loadFormData();
  }, [activeTab]);

  const handleFormDataChange = (data) => {
    const updatedFormData = { ...formData, [tabLabels[activeTab]]: data };
    setFormData(updatedFormData);
    localStorage.setItem("packageDetail", JSON.stringify(updatedFormData));
  };

  const handleTabChange = (index) => {
    if (isEditing || index >= activeTab) {
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <BasicInfoForm
            formData={formData}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
            isEditing={isEditing}
          />
        );
      case 1:
        return (
          <AirlineForm
            formData={formData}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
            isEditing={isEditing}
          />
        );
      case 2:
        return (
          <TransportForm
            formData={formData}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
            isEditing={isEditing}
          />
        );
      case 3:
        return (
          <ZiyarahForm
            formData={formData}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
            isEditing={isEditing}
          />
        );
      case 4:
        return (
          <MakkahHotelForm
            formData={formData}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
            isEditing={isEditing}
          />
        );
      case 5:
        return (
          <MadinaHotelForm
            formData={formData}
            onChange={handleFormDataChange}
            onNextTab={handleNextTab}
            isEditing={isEditing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AdminPanelLayout
      title={isEditing ? "Edit Package" : "Package Enrollment"}
      subtitle="Update package sections and continue to the next step."
      mainClassName="py-5 bg-[#f6f6f6]"
    >
      <div className="mt-2 mb-10 flex-grow">
        <h3 className="text-lg font-medium mb-2 text-gray-600">
          {isEditing ? "Edit Package" : "Package Enrollment"}
        </h3>
        <p className="text-sm font-thin text-gray-600 mb-4">
          Start to edit your enrolled packages by selecting of the following:
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
              disabled={!isEditing && index !== activeTab}
              className={`py-2 w-full px-4 md:px-0 lg:px-4 sm:py-4 text-xs lg:text-sm relative focus:outline-none ${
                activeTab === index
                  ? "text-gray-600 bg-[#E6F4F0]"
                  : completedTabs.has(index) && !isEditing
                  ? "text-[#00936C] font-medium"
                  : !isEditing && index !== activeTab
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 font-thin"
              }`}
              style={{
                fontSize: "clamp(10px, 1.5vw, 12px)",
                whiteSpace: "nowrap",
                cursor:
                  !isEditing && index !== activeTab ? "not-allowed" : "pointer",
              }}
            >
              {label}
              <div
                className={`absolute bottom-0 left-0 w-full h-[4px] ${
                  activeTab === index
                    ? "bg-[#4B465C]"
                    : completedTabs.has(index) && !isEditing
                    ? "bg-[#00936C]"
                    : "bg-gray-400"
                }`}
              />
            </button>
          ))}
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Loader
              type="spinner-cub"
              bgColor="#00936c"
              color="#00936c"
              title=""
              size={30}
            />
          </div>
        ) : (
          <div className="w-full mx-auto">{renderTabContent()}</div>
        )}
      </div>
    </AdminPanelLayout>
  );
};

export default EditPackagePage;
