import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AdminPanelLayout from "../../../../components/layout/AdminPanelLayout";
import Loader from "../../../../components/loader";
import { AppButton, AppCard, AppEmptyState } from "../../../../components/ui";
import errorIcon from "../../../../assets/error.svg";
import { getPackageDetails } from "../../../../utility/Api";

import BasicInfoForm from "../CreateCompanyPackageForms/BasicInformationForm";
import AirlineForm from "../CreateCompanyPackageForms/AirlineForm";
import TransportForm from "../CreateCompanyPackageForms/TransportForm";
import ZiyarahForm from "../CreateCompanyPackageForms/ZiyarahForm";
import MakkahHotelForm from "../CreateCompanyPackageForms/MakkahHotelForm";
import MadinaHotelForm from "../CreateCompanyPackageForms/MadinaHotelForm";

import {
  PACKAGE_FLOW_STORAGE_KEYS,
  PACKAGE_FLOW_TABS,
  readPackageFlowActiveTab,
  readPackageFlowCompletedTabs,
  readPackageFlowJson,
  writePackageFlowDraftToStorage,
} from "./packageFlowState";

const FLOW_COPY = {
  create: {
    layoutTitle: "Package Enrollment",
    layoutSubtitle: "Enter complete package details through each section.",
    heading: "Package Enrollment",
    description:
      "Start by telling us the detail of your package according to the following fields and ensure to enter the correct detail.",
  },
  continue: {
    layoutTitle: "Continue Package Enrollment",
    layoutSubtitle: "Resume and complete the remaining package sections.",
    heading: "Package Enrollment",
    description: "Resume the next incomplete package section for this existing package.",
  },
  edit: {
    layoutTitle: "Edit Package",
    layoutSubtitle: "Update package sections and continue to the next step.",
    heading: "Edit Package",
    description: "Review and update any section of your enrolled package.",
  },
};

const NOOP = () => {};

const STEP_COMPONENTS = [
  BasicInfoForm,
  AirlineForm,
  TransportForm,
  ZiyarahForm,
  MakkahHotelForm,
  MadinaHotelForm,
];

const PackageFlowPage = ({ mode = "create" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const copy = FLOW_COPY[mode] || FLOW_COPY.create;
  const isEditing = mode === "edit";
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const partnerSessionToken = searchParams.get("partnerSessionToken");
  const huzToken = searchParams.get("huzToken");

  const [activeTab, setActiveTab] = useState(() => readPackageFlowActiveTab());
  const [completedTabs, setCompletedTabs] = useState(
    () => new Set(readPackageFlowCompletedTabs())
  );
  const [loading, setLoading] = useState(mode !== "create");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (mode === "create") {
      setActiveTab(readPackageFlowActiveTab());
      setCompletedTabs(new Set(readPackageFlowCompletedTabs()));
      setLoading(false);
      setLoadError("");
      return;
    }

    let isCancelled = false;

    const syncLoadedPackage = (packageDetail, force = false) => {
      writePackageFlowDraftToStorage(packageDetail, { mode, force });
      if (isCancelled) {
        return;
      }

      setActiveTab(readPackageFlowActiveTab());
      setCompletedTabs(new Set(readPackageFlowCompletedTabs()));
      setLoadError("");
      setLoading(false);
    };

    const loadPackageContext = async () => {
      setLoading(true);
      setLoadError("");

      const statePackageDetail = location.state?.packageDetail;
      if (statePackageDetail) {
        syncLoadedPackage(statePackageDetail, true);
        return;
      }

      const storedPackageDetail = readPackageFlowJson(
        PACKAGE_FLOW_STORAGE_KEYS.packageDetail,
        null
      );

      if (
        storedPackageDetail?.huz_token &&
        (!huzToken || storedPackageDetail.huz_token === huzToken)
      ) {
        syncLoadedPackage(storedPackageDetail, false);
        return;
      }

      if (!partnerSessionToken || !huzToken) {
        if (!isCancelled) {
          setLoadError(
            mode === "continue"
              ? "Open the package from package management to continue enrollment."
              : "Open the package from package management to continue editing."
          );
          setLoading(false);
        }
        return;
      }

      try {
        const result = await getPackageDetails(partnerSessionToken, huzToken);
        const packageDetail = Array.isArray(result) ? result[0] : null;

        if (!packageDetail) {
          throw new Error("Package details were not found.");
        }

        syncLoadedPackage(packageDetail, true);
      } catch (error) {
        if (!isCancelled) {
          setLoadError(error.message || "Unable to load package details.");
          setLoading(false);
        }
      }
    };

    loadPackageContext();

    return () => {
      isCancelled = true;
    };
  }, [huzToken, location.search, location.state, mode, partnerSessionToken]);

  const persistProgress = (nextTabIndex, nextCompletedTabs) => {
    localStorage.setItem(
      PACKAGE_FLOW_STORAGE_KEYS.completedTabs,
      JSON.stringify(nextCompletedTabs)
    );
    localStorage.setItem(
      PACKAGE_FLOW_STORAGE_KEYS.activeTab,
      JSON.stringify(nextTabIndex)
    );
  };

  const handleNextTab = (updatedPackageDetail) => {
    if (updatedPackageDetail && typeof updatedPackageDetail === "object") {
      localStorage.setItem(
        PACKAGE_FLOW_STORAGE_KEYS.packageDetail,
        JSON.stringify(updatedPackageDetail)
      );

      if (updatedPackageDetail?.huz_token) {
        localStorage.setItem(
          PACKAGE_FLOW_STORAGE_KEYS.huzToken,
          updatedPackageDetail.huz_token
        );
      }
    }

    const currentLabel = PACKAGE_FLOW_TABS[activeTab];
    const nextCompletedTabs = PACKAGE_FLOW_TABS.filter(
      (label) => completedTabs.has(label) || label === currentLabel
    );
    const nextTabIndex = Math.min(activeTab + 1, PACKAGE_FLOW_TABS.length - 1);

    setCompletedTabs(new Set(nextCompletedTabs));
    setActiveTab(nextTabIndex);
    persistProgress(nextTabIndex, nextCompletedTabs);
  };

  const handleTabChange = (index) => {
    const label = PACKAGE_FLOW_TABS[index];
    const canAccessTab =
      mode === "edit" ||
      (mode === "create" && (index <= activeTab || completedTabs.has(label))) ||
      index === activeTab;

    if (!canAccessTab) {
      return;
    }

    setActiveTab(index);
    localStorage.setItem(PACKAGE_FLOW_STORAGE_KEYS.activeTab, JSON.stringify(index));
  };

  const ActiveStepComponent = STEP_COMPONENTS[activeTab] || null;

  return (
    <AdminPanelLayout
      title={copy.layoutTitle}
      subtitle={copy.layoutSubtitle}
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

      <div className="mt-2 mb-10 flex-grow">
        <h3 className="text-lg font-medium mb-2 text-gray-600">{copy.heading}</h3>
        <p className="text-sm font-thin text-gray-600 mb-4">{copy.description}</p>
        <div
          className="w-full mt-6 flex overflow-x-auto no-scrollbar mb-4 space-x-1"
          style={{ scrollbarWidth: "none" }}
        >
          <style jsx>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {PACKAGE_FLOW_TABS.map((label, index) => {
            const isSelected = activeTab === index;
            const isCompleted = completedTabs.has(label);
            const isDisabled =
              mode === "continue"
                ? !isSelected
                : mode === "create"
                ? index > activeTab && !isCompleted
                : false;

            return (
              <button
                key={label}
                onClick={() => handleTabChange(index)}
                disabled={isDisabled}
                className={`py-2 w-full px-4 md:px-0 lg:px-4 sm:py-4 text-xs lg:text-sm relative focus:outline-none ${
                  isSelected
                    ? "text-gray-600 bg-[#E6F4F0]"
                    : isCompleted
                    ? "text-[#00936C] font-medium"
                    : isDisabled
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
                    isSelected
                      ? "bg-[#4B465C]"
                      : isCompleted
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
        ) : !loadError && ActiveStepComponent ? (
          <div className="w-full mx-auto">
            <ActiveStepComponent
              formData={undefined}
              onChange={NOOP}
              onNextTab={handleNextTab}
              isEditing={isEditing}
            />
          </div>
        ) : null}
      </div>
    </AdminPanelLayout>
  );
};

export default PackageFlowPage;
