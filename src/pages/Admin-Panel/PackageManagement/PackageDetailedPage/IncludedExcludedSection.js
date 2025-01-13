// IncludedExcludedSection.js
import React from "react";
import { TbCheckbox } from "react-icons/tb";
import { RiCheckboxIndeterminateLine } from "react-icons/ri";

const renderCheck = (condition, name) => (
  <div
    className={`flex gap-2 items-center ${
      condition ? "text-[#00936c] text-[14px]" : "hidden"
    }`}
  >
    <TbCheckbox className={`h-3 md:h-4 ${condition ? "" : "text-red-500"}`} />
    <p className="text-[14px] font-[500]">{condition ? name : ""}</p>
  </div>
);

const renderCheckFalse = (condition, name) => (
  <div
    className={`flex gap-2 items-center ${
      condition ? "hidden" : "text-red-500 text-[14px]"
    }`}
  >
    <RiCheckboxIndeterminateLine
      className={`h-3 md:h-4 ${condition ? "" : "text-red-500"}`}
    />
    <p className="text-[14px] font-[500]">{condition ? "" : name}</p>
  </div>
);

const IncludedExcludedSection = ({ packageDetail }) => (
  <div className="space-y-3 w-full">
    <div className="md:flex gap-5 items-center">
      <span className="sm:text-base md:text-lg">Included:</span>
      <div className="w-full">
        <div className="space-y-2 md:space-y-0 md:flex gap-3 flex-wrap">
          <p className="text-[18px] font-[600]"></p>
          {renderCheck(packageDetail.is_visa_included, "Visa")}
          {renderCheck(packageDetail.is_insurance_included, "Insurance")}
          {renderCheck(
            packageDetail.is_airport_reception_included,
            "Airport Reception"
          )}
          {renderCheck(packageDetail.is_tour_guide_included, "Tour Guide")}
          {renderCheck(packageDetail.is_breakfast_included, "Breakfast")}
          {renderCheck(packageDetail.is_lunch_included, "Lunch")}
          {renderCheck(packageDetail.is_dinner_included, "Dinner")}
        </div>
      </div>
    </div>
    <hr className="w-full" />
    <div className="mt-4 md:flex gap-5 items-center">
      <span className="sm:text-base md:text-lg">Excluded:</span>
      <div className="w-full">
        <div className="space-y-2 md:space-y-0 md:flex gap-3 flex-wrap">
          <p className="text-sm font-thin"></p>
          {renderCheckFalse(packageDetail.is_visa_included, "Visa")}
          {renderCheckFalse(packageDetail.is_insurance_included, "Insurance")}
          {renderCheckFalse(
            packageDetail.is_airport_reception_included,
            "Airport Reception"
          )}
          {renderCheckFalse(packageDetail.is_tour_guide_included, "Tour Guide")}
          {renderCheckFalse(packageDetail.is_breakfast_included, "Breakfast")}
          {renderCheckFalse(packageDetail.is_lunch_included, "Lunch")}
          {renderCheckFalse(packageDetail.is_dinner_included, "Dinner")}
        </div>
      </div>
    </div>
  </div>
);

export default IncludedExcludedSection;
