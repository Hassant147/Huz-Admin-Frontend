import React from "react";
import { TbCheckbox } from "react-icons/tb";
import route from "../../../../assets/route.svg";
import { NumericFormat } from "react-number-format";
import edit from "../../../../assets/editLogo.svg";
import DeactivateButton from "../../../../components/DeactivateButton";
import ActivateButton from "../../../../components/ActivateButton"; // Adjust the import path as needed
import { Toaster } from "react-hot-toast";
import { AppButton, AppCard } from "../../../../components/ui";
import { getPartnerSessionToken } from "../../../../utility/session";

const Card = ({
  imageUrl,
  title,
  capacity,
  availability,
  route1,
  route2,
  price,
  transportPackage,
  type,
  packageType,
  setSelectedStatus, // Receive the setSelectedStatus prop
}) => {
  const partnerSessionToken = getPartnerSessionToken();
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
    <AppCard className="overflow-hidden border-slate-200 flex flex-col gap-0 p-0 md:flex-row">
      <img
        src={imageUrl}
        alt={title}
        className="h-[220px] w-full object-cover md:h-auto md:w-[260px]"
      />
      <div className="flex-1 p-5 md:p-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[#243447]">{title}</h2>
          <p className="hidden h-6 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 md:block">
            {type}
          </p>
        </div>
        <p className="mt-2 text-sm text-ink-700">
          {capacity} People Sitting capacity
        </p>
        <div className="mb-3 mt-2 flex flex-wrap lg:mb-7">
          {availabilityDays.map((day) => (
            <div key={day} className="flex items-center text-sm mr-4">
              <TbCheckbox className="text-[#00936c]" />
              <span className="ml-2 text-[#4b465c]">{day}</span>
            </div>
          ))}
        </div>
        <p className="flex items-center gap-2 text-sm text-[#4b465c]">
          <img src={route} alt="" />
          {route1} {packageType === "Fix Route" ? ` to ${route2}` : ""}
        </p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
          <div className="flex flex-wrap gap-2 text-sm">
            {transportPackage.package_status === "Deactivated" ? (
              <ActivateButton
                packageType="transport"
                sessionToken={partnerSessionToken}
                transportToken={transportPackage.transport_token}
                setSelectedStatus={setSelectedStatus} // Pass the prop down
              />
            ) : (
              <DeactivateButton
                packageType="transport"
                sessionToken={partnerSessionToken}
                transportToken={transportPackage.transport_token}
                setSelectedStatus={setSelectedStatus} // Pass the prop down
              />
            )}
            <AppButton
              size="sm"
              startIcon={<img src={edit} alt="" className="h-4" />}
              onClick={handleEdit}
            >
              Edit
            </AppButton>
          </div>
        </div>
      </div>
      <Toaster />
    </AppCard>
  );
};

export default Card;
