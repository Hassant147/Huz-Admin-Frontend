import React, { useState } from "react";
import { deactivateTransportPackage, deactivatePackage } from "../utility/Api"; // Ensure the correct API import
import { toast } from "react-hot-toast";
import inactive from "../assets/deactivateWhite.svg";
import { AppButton } from "./ui";

const DeactivateButton = ({ onSuccess, onError, sessionToken, transportToken, huzToken, packageType, setSelectedStatus }) => {
  const [loading, setLoading] = useState(false);

  const handleDeactivateClick = async () => {
    setLoading(true);
    try {
      let result;
      if (packageType === "transport") {
        result = await deactivateTransportPackage(sessionToken, transportToken, 'Deactivated');
      } else {
        result = await deactivatePackage(sessionToken, huzToken, 'Deactivated');
      }
      
      toast.success("Package successfully deactivated!", { duration: 5000 }); // Show success toast for 5 seconds
      if (onSuccess) onSuccess(result);
      if (packageType === "transport") {
        setSelectedStatus("Deactivated"); // Update status to Deactivated if packageType is "transport"
      }
    } catch (error) {
      console.error("Deactivation Error:", error);
      toast.error("An error occurred while deactivating the package.", { duration: 5000 }); // Show error toast for 5 seconds
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppButton
      variant="danger"
      size="sm"
      className="min-w-[124px]"
      onClick={handleDeactivateClick}
      loading={loading}
      loadingLabel="Deactivating..."
      startIcon={!loading ? <img src={inactive} alt="" className="h-3" /> : null}
    >
      Deactivate
    </AppButton>
  );
};

export default DeactivateButton;
