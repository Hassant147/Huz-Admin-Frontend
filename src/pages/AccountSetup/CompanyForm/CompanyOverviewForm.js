import React, { useState, useEffect, useRef } from "react";
import { BiErrorAlt } from "react-icons/bi";
import Select from "react-select";

const CompanyOverviewForm = ({ formData, onChange, onNextTab }) => {
  const [yearsOfExperience, setYearsOfExperience] = useState(
    formData?.yearsOfExperience || ""
  );
  const [companyDetail, setCompanyDetail] = useState(
    formData?.companyDetail || ""
  );
  const [errors, setErrors] = useState({
    yearsOfExperience: "",
    companyDetail: "",
  });

  const yearsOfExperienceRef = useRef(null);
  const companyDetailRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("CompanyOverview", JSON.stringify(formData));
  }, [formData]);

  const notifyParent = (updatedData) => {
    if (onChange) {
      onChange(updatedData);
    }
  };

  const handleFieldChange = (field, value) => {
    const updatedData = {
      yearsOfExperience,
      companyDetail,
      [field]: value,
    };

    switch (field) {
      case "yearsOfExperience":
        setYearsOfExperience(value);
        break;
      case "companyDetail":
        setCompanyDetail(value);
        break;
      default:
        break;
    }

    notifyParent(updatedData);
  };

  const validateField = (field, value) => {
    if (!value) {
      return field === "yearsOfExperience"
        ? "Total years of experience is required"
        : "Company detail is required";
    }
    return "";
  };

  const validate = () => {
    let valid = true;
    const newErrors = {};

    ["yearsOfExperience", "companyDetail"].forEach((field) => {
      const error = validateField(field, eval(field));
      if (error) {
        newErrors[field] = error;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleBlur = (field) => {
    const error = validateField(field, eval(field));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleContinue = () => {
    if (!validate()) {
      // Set focus to the first input with an error
      [yearsOfExperienceRef, companyDetailRef].find((ref) => {
        if (ref.current && errors[ref.current.name]) {
          ref.current.focus();
          return true;
        }
        return false;
      });
    } else {
      onNextTab();
      const CompanyOverview = JSON.parse(
        localStorage.getItem("CompanyOverview")
      );
    }
  };

  const yearsOptions = [...Array(31).keys()]
    .map((year) => ({
      value: year,
      label: `${year} year${year !== 1 ? "s" : ""}`,
    }))
    .concat({ value: "30+", label: "30+ years" });

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6">
      <div className="space-y-4 lg:w-3/4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <label htmlFor="phoneNumber" className="block text-sm font-light text-gray-600 mb-2">
            Total years of experience
          {" "}
            <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
              *
              </span>
          </label>
          <Select
            ref={yearsOfExperienceRef}
            name="yearsOfExperience"
            value={yearsOptions.find(
              (option) => option.value === yearsOfExperience
            )}
            onChange={(option) =>
              handleFieldChange("yearsOfExperience", option?.value)
            }
            onBlur={() => handleBlur("yearsOfExperience")}
            options={yearsOptions}
            styles={{
              control: (provided, state) => ({
                ...provided,
                fontSize: "0.75rem", // Adjust the font size here
                borderColor: state.isFocused ? "#718096" : "#cbd5e0", // Border color when focused or unfocused
                width: "100%", // Set default width to 100%
                "@media (min-width: 1024px)": {
                  width: "100%", // Set width to 3/4 for lg screens
                },
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? "#00936C" : "inherit", // Set the background color for selected option
              }),
            }}
            classNamePrefix="react-select"
            className={`react-select-container lg:w-3/4 ${errors.countryRegion ? "border-red-500" : "border-gray-400"
              }`}
          />
          {errors.yearsOfExperience && (
            <div
              className="text-red-500 text-xs flex items-center
            gap-1 mt-1"
            >
              <BiErrorAlt />{" "}
              <p className="text-xs font-thin text-red-500">
                {errors.yearsOfExperience}
              </p>
            </div>
          )}
          <label htmlFor="phoneNumber" className="block text-sm font-light text-gray-600 mb-2 mt-4">
            Describe who you are and what drives your business.
          {" "}
            <span style={{ color: "red", fontWeight: "bold", verticalAlign: "middle" }}>
              *
              </span>
          </label>
          <textarea
            ref={companyDetailRef}
            name="companyDetail"
            value={companyDetail}
            onChange={(e) => handleFieldChange("companyDetail", e.target.value)}
            onBlur={() => handleBlur("companyDetail")}
            className={`p-2 border outline-none rounded-md w-full lg:w-3/4 font-thin text-sm shadow-sm ${errors.companyDetail && "border-red-500"
              }`}
            placeholder={`- introduction of your company\n- years in business\n- Special achievements or certifications\n- Mission and values and etc. `}
            style={{ fontSize: "0.80rem" }}
            rows={6}
          />
          {errors.companyDetail && (
            <div
              className="text-red-500 text-xs flex items-center
            gap-1 "
            >
              <BiErrorAlt />{" "}
              <p className="text-xs font-thin text-red-500">
                {errors.companyDetail}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleContinue}
          className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
        >
          Continue
        </button>
      </div>

      <div className="mt-4 lg:mt-0 lg:w-1/4 h-1/4 p-4 bg-[#E6F4F0] rounded-lg border border-green-200 shadow-sm">
        <p className="text-xs text-gray-700">
          Please ensure that the information you provide is accurate and
          carefully considered. HUZ Solutions will verify the data submitted
          during registration prior to listing your company on the platform.
        </p>
      </div>
    </div>
  );
};

export default CompanyOverviewForm;
