import React, { useState } from "react";
import { deactivateTransportPackage, deactivatePackage } from "../utility/Api"; // Ensure the correct API import
import Loader from "react-js-loader";
import { toast } from "react-hot-toast";
import inactive from "../assets/deactivateWhite.svg";

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
    <>
      <button
        className="bg-[#CB5353] hover:bg-red-800 text-white text-sm py-2 px-4 rounded flex items-center justify-center"
        onClick={handleDeactivateClick}
        disabled={loading}
        style={{ height: "40px" }}
      >
        {loading ? (
          <Loader type="spinner-cub" bgColor="#ffffff" color="#ffffff" size={20} />
        ) : (
          <div className="flex gap-2 items-center">
            <img src={inactive} alt="" className="h-3" />
            Deactivate
          </div>
        )}
      </button>
    </>
  );
};

export default DeactivateButton;
