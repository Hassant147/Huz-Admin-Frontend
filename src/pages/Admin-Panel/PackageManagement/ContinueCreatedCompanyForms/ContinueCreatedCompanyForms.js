import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AdminPanelLayout from "../../../../components/layout/AdminPanelLayout";
import Loader from "../../../../components/loader";
import { AppButton, AppCard, AppEmptyState } from "../../../../components/ui";
import errorIcon from "../../../../assets/error.svg";
import { getPackageDetails } from "../../../../utility/Api";

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
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({});
  const [completedTabs, setCompletedTabs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const partnerSessionToken = searchParams.get("partnerSessionToken");
  const huzToken = searchParams.get("huzToken");

  const hydrateFromPackageDetail = useCallback((packageDetail) => {
    if (!packageDetail) {
      return false;
    }

    const completedTabsFromStorage = new Set(
      JSON.parse(localStorage.getItem("completedTabs")) || []
    );
    const hotelDetails = Array.isArray(packageDetail.hotel_detail)
      ? packageDetail.hotel_detail
      : [];

    setFormData({
      "Basic Information": packageDetail.company_details,
      Airline: packageDetail.airline_detail?.[0],
      Transport: packageDetail.transport_detail?.[0] || {},
      Ziyarah: packageDetail.ziyarah_detail?.[0] || {},
      "Makkah Hotel":
        hotelDetails.find((hotel) => hotel.hotel_city?.toLowerCase() === "mecca") || {},
      "Madina Hotel":
        hotelDetails.find((hotel) => hotel.hotel_city?.toLowerCase() === "madinah") || {},
    });
    setCompletedTabs(completedTabsFromStorage);
    localStorage.setItem("packageDetail", JSON.stringify(packageDetail));
    localStorage.setItem("huz_token", packageDetail.huz_token);

    const firstIncompleteTab = tabLabels.findIndex(
      (label) => !completedTabsFromStorage.has(label)
    );
    if (firstIncompleteTab !== -1) {
      setActiveTab(firstIncompleteTab);
    }
    return true;
  }, []);

  useEffect(() => {
    const loadPackageContext = async () => {
      setLoadError("");
      const storedPackageDetail = localStorage.getItem("packageDetail");
      if (storedPackageDetail) {
        try {
          if (hydrateFromPackageDetail(JSON.parse(storedPackageDetail))) {
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Unable to parse stored package detail:", error);
        }
      }

      if (partnerSessionToken && huzToken) {
        try {
          const data = await getPackageDetails(partnerSessionToken, huzToken);
          const packageDetail = Array.isArray(data) ? data[0] : null;
          if (!hydrateFromPackageDetail(packageDetail)) {
            throw new Error("Package details were not found.");
          }
        } catch (error) {
          setLoadError(error.message || "Unable to load package details.");
        }
      } else {
        setLoadError("Open the package from package management to continue enrollment.");
      }

      setLoading(false);
    };

    loadPackageContext();
  }, [hydrateFromPackageDetail, huzToken, partnerSessionToken]);

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
    <AdminPanelLayout
      title="Continue Package Enrollment"
      subtitle="Resume and complete the remaining package sections."
      mainClassName="py-5 bg-[#f6f6f6]"
    >
      {loadError ? (
        <AppCard>
          <AppEmptyState
            icon={<img src={errorIcon} alt="" className="h-6 w-6" />}
            title="Package not loaded"
            message={loadError}
            action={
              <AppButton size="sm" onClick={() => navigate("/packages")}>
                Go to Packages
              </AppButton>
            }
          />
        </AppCard>
      ) : null}

      <div className="lg:mt-4 mt-2 mb-10 flex-grow">
        <h3 className="text-lg font-medium mb-2 text-gray-600">
          Package Enrollment
        </h3>
        <p className="text-sm font-thin text-gray-600 mb-4">
          Resume the next incomplete package section for this existing package.
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

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Loader />
          </div>
        ) : !loadError ? (
          <>
            <div className="w-[85%] lg:w-full mx-auto font-sans mt-10"></div>
            <div className="w-full mx-auto">{renderTabContent()}</div>
          </>
        ) : null}
      </div>
    </AdminPanelLayout>
  );
};

export default ContinueCreatedCompanyForms;
