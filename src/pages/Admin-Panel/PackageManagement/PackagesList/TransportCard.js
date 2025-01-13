import React, { useState } from "react";
import { TbCheckbox } from "react-icons/tb";
import route from "../../../../assets/route.svg";
import { NumericFormat } from "react-number-format";
import edit from "../../../../assets/editLogo.svg";
import DeactivateButton from "../../../../components/DeactivateButton";
import ActivateButton from "../../../../components/ActivateButton"; // Adjust the import path as needed
import { Toaster } from "react-hot-toast";

const Card = ({
  imageUrl,
  title,
  capacity,
  availability,
  route1,
  route2,
  price,
  plateNo,
  transportPackage,
  type,
  packageType,
  setSelectedStatus, // Receive the setSelectedStatus prop
}) => {
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(Date.now()); // State to trigger re-render
  const { partner_session_token } = JSON.parse(
    localStorage.getItem("SignedUp-User-Profile")
  );
  const availabilityDays =
    typeof availability === "string" ? availability.split(", ") : [];
  const handleEdit = () => {
    localStorage.setItem(
      "editTransportPackage",
      JSON.stringify({ ...transportPackage, isEditing: true })
    );
    window.location.href = "/individual/package-creation"; // Navigate to the edit page
  };

  return (
    <div
      key={key}
      className="border rounded-lg shadow-lg flex flex-col md:flex-row mb-6"
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full xl:h-[233px] md:w-1/4 rounded-l-lg object-cover"
      />
      <div className="flex-1 p-4 pl-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-normal text-[#4B465C]">{title}</h2>
          <p className="hidden md:block text-xs text-[#4b465c] p-1 bg-[#E6F4F0] rounded-md h-6 px-3">
            {type}
          </p>
        </div>
        <p className="text-[#4B465C] mt-2 text-sm font-thin">
          {capacity} People Sitting capacity
        </p>
        <div className="flex flex-wrap mb-3 lg:mb-7">
          {availabilityDays.map((day) => (
            <div key={day} className="flex items-center text-sm mr-4">
              <TbCheckbox className="text-[#00936c]" />
              <span className="ml-2 text-[#4b465c]">{day}</span>
            </div>
          ))}
        </div>
        <p className="text-[#4b465c] flex items-center gap-2 text-sm ">
          <img src={route} alt="" />
          {route1} {packageType === "Fix Route" ? ` to ${route2}` : ""}
        </p>
        <div className="md:flex justify-between items-center">
          <div className="flex items-center gap-3">
            <NumericFormat
              value={price}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"PKR "}
              className="text-[#00936C] text-base font-semibold"
            />
            <p className="text-sm text-[#4b465c]">
              {packageType === "Fix Route" ? "" : `${route2}`}
            </p>
          </div>
          <div className="flex gap-2 text-sm p-4">
            {transportPackage.package_status === "Deactivated" ? (
              <ActivateButton
                packageType="transport"
                sessionToken={partner_session_token}
                transportToken={transportPackage.transport_token}
                setSelectedStatus={setSelectedStatus} // Pass the prop down
              />
            ) : (
              <DeactivateButton
                packageType="transport"
                sessionToken={partner_session_token}
                transportToken={transportPackage.transport_token}
                setSelectedStatus={setSelectedStatus} // Pass the prop down
              />
            )}
            <button
              className="bg-[#00936C] hover:bg-[#048462] flex items-center gap-2 text-white px-4 py-2 rounded-md"
              onClick={handleEdit}
            >
              <img src={edit} alt="" className="h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Card;
