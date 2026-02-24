import React, { useState } from "react";
import { deactivateTransportPackage, deactivatePackage } from "../utility/Api"; // Ensure the correct API import
import { toast } from "react-hot-toast";
import active from "../assets/active.svg"; // Replace with appropriate icon
import { AppButton } from "./ui";

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
    <AppButton
      variant="secondary"
      size="sm"
      className="min-w-[118px]"
      onClick={handleActivateClick}
      loading={loading}
      loadingLabel="Activating..."
      startIcon={!loading ? <img src={active} alt="" className="h-3" /> : null}
    >
      Activate
    </AppButton>
  );
};

export default ActivateButton;
