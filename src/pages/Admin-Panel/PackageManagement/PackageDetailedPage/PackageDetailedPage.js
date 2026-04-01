import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPackageDetails } from "../../../../utility/Api"; // Adjust this import as needed
import Loader from "../../../../components/loader";
import AdminPanelLayout from "../../../../components/layout/AdminPanelLayout";
import HeaderSection from "./HeaderSection";
import IncludedExcludedSection from "./IncludedExcludedSection";
import HotelDetailsSection from "./HotelDetailsSection";
import AirlineTransportSection from "./AirlineTransportSection";
import edit from "../../../../assets/editLogo1.svg";
import DeactivateButton from "../../../../components/DeactivateButton"; // Adjust the import path as needed
import ActivateButton from "../../../../components/ActivateButton"; // Adjust the import path as needed
import { Toaster } from "react-hot-toast";
import {
  buildPackageFlowEntryPath,
  writePackageFlowDraftToStorage,
} from "../packageFlow/packageFlowState";

const DetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const partnerSessionToken = queryParams.get("partnerSessionToken");
  const huzToken = queryParams.get("huzToken");

  const [packageDetail, setPackageDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        if (!partnerSessionToken || !huzToken) {
          throw new Error("Missing session token or huz token.");
        }
        const data = await getPackageDetails(partnerSessionToken, huzToken);
        if (data && data.length > 0) {
          setPackageDetail(data[0]);
        } else {
          throw new Error("No package details found.");
        }
      } catch (error) {
        setError(
          error.message || "An error occurred while fetching package details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [partnerSessionToken, huzToken]);
  const total_nights =
    packageDetail && packageDetail.mecca_nights + packageDetail.madinah_nights;
  const handleEditClick = () => {
    if (!packageDetail) {
      return;
    }

    writePackageFlowDraftToStorage(packageDetail, {
      mode: packageDetail.package_stage < 6 ? "continue" : "edit",
      force: true,
    });

    navigate(
      buildPackageFlowEntryPath(
        packageDetail,
        partnerSessionToken || "",
        huzToken || ""
      ),
      { state: { packageDetail } }
    );
  };

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="error" role="alert">
        {error}
      </div>
    );
  }

  const handleSuccess = (result) => {
    setPackageDetail((prevDetail) => ({
      ...prevDetail,
      package_status: result.package_status,
    }));
  };

  return (
    <AdminPanelLayout
      title="Package Details"
      subtitle="Review, activate/deactivate, and edit your package."
      mainClassName="py-5 bg-[#f6f6f6]"
    >
      <div className="font-sans">
        <div className=" p-5 rounded-lg text-[#4B465C]">
          {packageDetail ? (
            <div className="space-y-3">
              <HeaderSection
                total_nights={total_nights}
                packageDetail={packageDetail}
                handleEditClick={handleEditClick}
                partnerSessionToken={partnerSessionToken} // Pass token as prop
                huzToken={huzToken} // Pass token as prop
                handleSuccess={(updatedPackageDetail) =>
                  setPackageDetail(updatedPackageDetail)
                }
              />
              <hr className="w-full" />
              <IncludedExcludedSection packageDetail={packageDetail} />
              <hr className="w-full" />
              <HotelDetailsSection packageDetail={packageDetail} />
              <hr className="w-full" />
              <AirlineTransportSection packageDetail={packageDetail} />
              <div className="flex gap-2 justify-center bg-[#00936C1A] p-6 ">
                {packageDetail.package_status === "Deactivated" ? (
                  <ActivateButton
                    packageType="hajjUmrah"
                    sessionToken={partnerSessionToken}
                    huzToken={huzToken}
                    onSuccess={handleSuccess}
                  />
                ) : (
                  <DeactivateButton
                    packageType="hajjUmrah"
                    sessionToken={partnerSessionToken}
                    huzToken={huzToken}
                    onSuccess={handleSuccess}
                  />
                )}

                <button
                  className="bg-[#E6F4F0] hover:bg-[#E1E7E5] justify-center flex gap-2 items-center text-[#00936c] text-sm py-2 px-4 rounded"
                  onClick={handleEditClick}
                >
                  <img src={edit} alt="" className="h-3" />
                  Edit
                </button>
              </div>
            </div>
          ) : (
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
                title="Loading"
                size={50}
              />
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </AdminPanelLayout>
  );
};

export default DetailPage;
