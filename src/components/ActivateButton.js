import React, { useState } from "react";
import { deactivateTransportPackage, deactivatePackage } from "../utility/Api"; // Ensure the correct API import
import Loader from "react-js-loader";
import { toast } from "react-hot-toast";
import active from "../assets/active.svg"; // Replace with appropriate icon

const ActivateButton = ({
  onSuccess,
  onError,
  sessionToken,
  transportToken,
  huzToken,
  packageType,
  setSelectedStatus,
}) => {
  const [loading, setLoading] = useState(false);

  const handleActivateClick = async () => {
    setLoading(true);
    try {
      let result;
      if (packageType === "transport") {
        result = await deactivateTransportPackage(
          sessionToken,
          transportToken,
          "Active"
        );
      } else {
        result = await deactivatePackage(sessionToken, huzToken, "Active");
      }

      toast.success("Package successfully activated!", { duration: 5000 }); // Show success toast for 5 seconds
      if (onSuccess) onSuccess(result);
      if (packageType === "transport") {
        setSelectedStatus("Active"); // Update status to Active if packageType is "transport"
      }
    } catch (error) {
      console.error("Activation Error:", error);
      toast.error("An error occurred while activating the package.", {
        duration: 5000,
      }); // Show error toast for 5 seconds
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-[#57726A] hover:bg-[#4D675F] transition-all duration-150 text-white text-sm py-2 px-4 rounded flex items-center justify-center"
        onClick={handleActivateClick}
        disabled={loading}
        style={{ height: "40px" }}
      >
        {loading ? (
          <Loader
            type="spinner-cub"
            bgColor="#ffffff"
            color="#ffffff"
            size={20}
          />
        ) : (
          <div className="flex gap-2 items-center">
            <img src={active} alt="" className="h-3" />
            Activate
          </div>
        )}
      </button>
    </>
  );
};

export default ActivateButton;
