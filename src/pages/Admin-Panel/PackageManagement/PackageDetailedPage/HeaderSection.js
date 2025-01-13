import React from "react";
import edit from "../../../../assets/editLogo1.svg";
import inactive from "../../../../assets/transportBtnInactive.svg";
import share from "../../../../assets/Share1.svg";
import { NumericFormat } from "react-number-format";
import bgLogo from "../../../../assets/bgLogo.svg";
import DeactivateButton from "../../../../components/DeactivateButton";
import ActivateButton from "../../../../components/ActivateButton"; // Adjust the import path as needed

const HeaderSection = ({
  packageDetail,
  handleEditClick,
  partnerSessionToken,
  huzToken,
  handleSuccess,
  total_nights,
}) => (
  <div className="space-y-3 ">
    <div
      className="bg-[#00936c] rounded-md p-6 text-white md:flex md:justify-between items-center space-y-2 md:space-y-0"
      style={{ backgroundImage: `url(${bgLogo})` }}
    >
      <div className="flex gap-5 ">
        <div className="my-4 md:my-0">
          <p className="text-xl md:text-2xl font-medium">
            {packageDetail.package_name}
          </p>
          <p className="text-xs font-normal mt-2">
            Validity {new Date(packageDetail.start_date).toLocaleDateString()}{" "}
            to {new Date(packageDetail.end_date).toLocaleDateString()}
          </p>
        </div>
        <div className="md:flex md:gap-2">
          <button className="flex items-center mt-1.5 h-6 gap-2 text-[#4b465c] p-2 rounded-md bg-[#F2F2F3]">
            <img src={share} alt="" className="hidden md:block" />
            <p className="text-[14px] font-[600]">Share</p>
          </button>
        </div>
      </div>
      <div className="flex gap-2 flex-col">
        {packageDetail.package_status === "Deactivated" ? (
          <ActivateButton
            packageType="hajjUmrah"
            sessionToken={partnerSessionToken}
            huzToken={huzToken}
            onSuccess={handleSuccess}
            onError={(error) => console.error("Activation Error:", error)}
          />
        ) : (
          <DeactivateButton
            packageType="hajjUmrah"
            sessionToken={partnerSessionToken}
            huzToken={huzToken}
            onSuccess={handleSuccess}
            onError={(error) => console.error("Deactivation Error:", error)}
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
    <div className="md:flex justify-between pt-5 gap-5">
      <p className="text-sm font-normal w-full">{packageDetail.description}</p>
      <div className="w-[40%]">
        <p className="text-[14px] font-[600] ">
          {total_nights} days package, {packageDetail.mecca_nights} day Makkah
          and {packageDetail.madinah_nights} day Madinah.
        </p>
        <p className="text-[#00936c] text-[26px] md:text-[30px] font-kd font-[700]">
          <NumericFormat
            value={packageDetail.package_base_cost}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"PKR "}
          />
          <span className="text-sm font-normal text-[#4b465c]">per person</span>{" "}
        </p>
      </div>
    </div>
  </div>
);

export default HeaderSection;
