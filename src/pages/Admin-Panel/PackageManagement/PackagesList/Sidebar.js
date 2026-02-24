import React, { useState } from "react";
import { AppCard, AppSectionHeader } from "../../../../components/ui";

const PACKAGE_TYPES = ["Hajj", "Umrah", "Transport"];

const Sidebar = ({ onFilterChange }) => {
  const [selectedType, setSelectedType] = useState("Hajj");

  const handleFilterChange = (type) => {
    setSelectedType(type);
    onFilterChange(type);
  };

  return (
    <AppCard className="sticky top-[144px] bg-white">
      <AppSectionHeader
        title="Package Type"
        subtitle="Switch between your product categories."
      />
      <div className="mt-3 flex flex-col gap-2">
        {PACKAGE_TYPES.map((type) => {
          const isSelected = selectedType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => handleFilterChange(type)}
              className={`w-full rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${
                isSelected
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 bg-white text-ink-700 hover:border-brand-200 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`h-4 w-4 rounded-full border ${
                    isSelected ? "border-brand-600 bg-brand-500" : "border-slate-400"
                  }`}
                  aria-hidden="true"
                />
                {type} Package
              </span>
            </button>
          );
        })}
      </div>
    </AppCard>
  );
};

export default Sidebar;
