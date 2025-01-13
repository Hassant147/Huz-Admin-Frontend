import React, { useState, useEffect, useRef } from "react";
import { enrollPackageBasicDetail, editPackageBasicDetail } from "../../../../utility/Api";
import ClipLoader from "react-spinners/ClipLoader";
import { BiErrorAlt } from "react-icons/bi";

const MAX_NIGHTS = 999; // Maximum number of nights allowed
const MAX_COST_LENGTH = 10; // Maximum length of cost fields

const ServiceCheckbox = ({ service, isChecked, onChange }) => (
  <div className="flex text-gray-600 items-center font-thin mr-4 text-xs lg:text-sm">
    <input
      type="checkbox"
      id={service}
      checked={isChecked}
      onChange={(e) => onChange(service, e.target.checked)}
      className="mr-2"
      style={{ accentColor: "#00936C" }}
    />
    <label htmlFor={service}>{service}</label>
  </div>
);

const BasicInfoForm = ({ formData, onChange, onNextTab, isEditing }) => {
  const [packageDetails, setPackageDetails] = useState({
    packageName: "",
    packageBaseCost: "",
    packageCostForChild: "",
    packageCostForInfants: "",
    packageCostForSharing: "",
    packageCostForQuad: "",
    packageCostForTriple: "",
    packageCostForDouble: "",
    packageCostForSingle: "",
    nightsInMecca: "",
    nightsInMadinah: "",
    startDate: "",
    endDate: "",
    packageDescription: "",
    flexibleDates: false,
    packageValidity: "",
    services: [],
  });

  const initialStateSet = useRef(false);

  useEffect(() => {
    if (!initialStateSet.current && isEditing && formData) {
      const initialData = {
        packageName: formData.package_name || "",
        packageBaseCost: formData.package_base_cost ? formData.package_base_cost.toString() : "",
        packageCostForChild: formData.cost_for_child ? formData.cost_for_child.toString() : "",
        packageCostForInfants: formData.cost_for_infants ? formData.cost_for_infants.toString() : "",
        packageCostForSharing: formData.cost_for_sharing ? formData.cost_for_sharing.toString() : "",
        packageCostForQuad: formData.cost_for_quad ? formData.cost_for_quad.toString() : "",
        packageCostForTriple: formData.cost_for_triple ? formData.cost_for_triple.toString() : "",
        packageCostForDouble: formData.cost_for_double ? formData.cost_for_double.toString() : "",
        packageCostForSingle: formData.cost_for_single ? formData.cost_for_single.toString() : "",
        nightsInMecca: formData.mecca_nights || "",
        nightsInMadinah: formData.madinah_nights || "",
        startDate: formData.start_date ? formData.start_date.split("T")[0] : "",
        endDate: formData.end_date ? formData.end_date.split("T")[0] : "",
        packageDescription: formData.description || "",
        flexibleDates: formData.is_package_open_for_other_date || false,
        packageValidity: formData.package_validity ? formData.package_validity.split("T")[0] : "",
        services: [
          ...(formData.is_visa_included ? ["Visa"] : []),
          ...(formData.is_airport_reception_included ? ["Airport Reception"] : []),
          ...(formData.is_tour_guide_included ? ["Tour Guide"] : []),
          ...(formData.is_insurance_included ? ["Insurance"] : []),
          ...(formData.is_breakfast_included ? ["Breakfast"] : []),
          ...(formData.is_lunch_included ? ["Lunch"] : []),
          ...(formData.is_dinner_included ? ["Dinner"] : []),
        ],
      };
      setPackageDetails(initialData);
      initialStateSet.current = true;
    }
  }, [isEditing, formData]);

  useEffect(() => {
    localStorage.setItem("basicDetails", JSON.stringify(packageDetails));
  }, [packageDetails]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const calculateEndDate = (startDate, nightsInMecca, nightsInMadinah) => {
    const totalNights = parseInt(nightsInMecca) + parseInt(nightsInMadinah);
    const start = new Date(startDate);
    start.setDate(start.getDate() + totalNights);
    return start.toISOString().split('T')[0];
  };

  const handleFieldChange = (field, value) => {
    if (field === "nightsInMecca" || field === "nightsInMadinah") {
      if (value.length > 3 || parseInt(value) > MAX_NIGHTS) {
        setErrors((prev) => ({
          ...prev,
          [field]: `Number of nights cannot exceed ${MAX_NIGHTS}.`,
        }));
        return;
      }
    }

    let updatedDetails = { ...packageDetails, [field]: value };
    if (field === "startDate" || field === "nightsInMecca" || field === "nightsInMadinah") {
      const { startDate, nightsInMecca, nightsInMadinah } = updatedDetails;
      if (startDate && nightsInMecca && nightsInMadinah) {
        updatedDetails.endDate = calculateEndDate(startDate, nightsInMecca, nightsInMadinah);
      }
    }
    if (field === "flexibleDates") {
      updatedDetails.packageValidity = value ? "" : packageDetails.endDate;
    }
    if (field === "packageValidity") {
      if (new Date(value) < new Date(packageDetails.startDate)) {
        setErrors((prev) => ({
          ...prev,
          packageValidity: "Package validity cannot be before the start date.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          packageValidity: "",
        }));
      }
    }
    setPackageDetails(updatedDetails);
    validateField(field, value);
    onChange(updatedDetails);
  };

  const validateField = (field, value) => {
    let error = "";
    if (typeof value === "string" && !value.trim()) {
      error = `${field.replace(/([A-Z])/g, " $1").trim()} is required`;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field) => {
    const value = packageDetails[field];
    validateField(field, value);
  };

  const mapServicesToApiFields = (services) => ({
    is_visa_included: services.includes("Visa"),
    is_airport_reception_included: services.includes("Airport Reception"),
    is_tour_guide_included: services.includes("Tour Guide"),
    is_insurance_included: services.includes("Insurance"),
    is_breakfast_included: services.includes("Breakfast"),
    is_lunch_included: services.includes("Lunch"),
    is_dinner_included: services.includes("Dinner"),
  });

  const handleContinue = async () => {
    const isValid = validateForm();
    if (isValid) {
      setLoading(true);
      setApiError("");

      const packageType = localStorage.getItem("package_type") || "Hajj";
      const { partner_session_token } = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
      const huzToken = isEditing ? formData.huz_token : localStorage.getItem("huz_token");

      const commonData = {
        partner_session_token,
        package_name: packageDetails.packageName,
        package_base_cost: parseFloat(packageDetails.packageBaseCost.replace(/,/g, "")),
        cost_for_child: parseFloat(packageDetails.packageCostForChild.replace(/,/g, "")),
        cost_for_infants: parseFloat(packageDetails.packageCostForInfants.replace(/,/g, "")),
        cost_for_sharing: parseFloat(packageDetails.packageCostForSharing.replace(/,/g, "")),
        cost_for_quad: parseFloat(packageDetails.packageCostForQuad.replace(/,/g, "")),
        cost_for_triple: parseFloat(packageDetails.packageCostForTriple.replace(/,/g, "")),
        cost_for_double: parseFloat(packageDetails.packageCostForDouble.replace(/,/g, "")),
        cost_for_single: parseFloat(packageDetails.packageCostForSingle.replace(/,/g, "")),
        mecca_nights: parseInt(packageDetails.nightsInMecca),
        madinah_nights: parseInt(packageDetails.nightsInMadinah),
        start_date: new Date(packageDetails.startDate).toISOString(),
        end_date: new Date(packageDetails.endDate).toISOString(),
        description: packageDetails.packageDescription,
        ...mapServicesToApiFields(packageDetails.services),
        is_package_open_for_other_date: packageDetails.flexibleDates,
        package_validity: packageDetails.packageValidity ? new Date(packageDetails.packageValidity).toISOString() : new Date(packageDetails.endDate).toISOString(),
      };
      let response;
      try {
        if (isEditing) {
          const editApiData = {
            ...commonData,
            huz_token: formData.huz_token,
          };
          response = await editPackageBasicDetail(editApiData);
          localStorage.setItem("packageDetail", JSON.stringify(response));
          onNextTab(response);
        } else {
          const enrollApiData = {
            ...commonData,
            package_type: packageType,
          };
          response = await enrollPackageBasicDetail(enrollApiData);
          localStorage.setItem("huz_token", response.huz_token);
          localStorage.setItem("packageDetail", JSON.stringify(response));
        }
        onNextTab();
      } catch (error) {
        setApiError(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  const formatNumberWithCommas = (number) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleCostChange = (field, value) => {
    const rawValue = value.replace(/,/g, '');
    if (/^\d*$/.test(rawValue)) {
      handleFieldChange(field, formatNumberWithCommas(rawValue));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    Object.keys(packageDetails).forEach((key) => {
      const value = packageDetails[key];
      if (typeof value === "string" && value.trim() === "") {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1").trim()} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const toggleService = (service) => {
    setPackageDetails((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleEndDateClick = () => {
    setErrors((prev) => ({
      ...prev,
      endDate: "End date cannot be modified directly. It is auto-calculated based on start date and nights.",
    }));
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 font-sans text-xs lg:text-sm">
      <div className="space-y-6 lg:w-3/4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Package name", field: "packageName" },
              { label: "Package base cost", field: "packageBaseCost", type: "text" },
              { label: "Cost for child", field: "packageCostForChild", type: "text" },
              { label: "Cost for infants", field: "packageCostForInfants", type: "text" },
              { label: "Cost for sharing", field: "packageCostForSharing", type: "text" },
              { label: "Cost for quad", field: "packageCostForQuad", type: "text" },
              { label: "Cost for triple", field: "packageCostForTriple", type: "text" },
              { label: "Cost for double", field: "packageCostForDouble", type: "text" },
              { label: "Cost for single", field: "packageCostForSingle", type: "text" },
              { label: "Nights in Mecca", field: "nightsInMecca", type: "number" },
              { label: "Nights in Madinah", field: "nightsInMadinah", type: "number" },
              { label: "Start date", field: "startDate", type: "date" },
              { label: "End date", field: "endDate", type: "date", readOnly: true },
            ].map((input) => (
              <div key={input.field}>
                <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
                  {input.label}
                </label>
                <input
                  type={input.type || "text"}
                  value={packageDetails[input.field]}
                  onChange={(e) =>
                    input.field.includes("Cost")
                      ? handleCostChange(input.field, e.target.value)
                      : handleFieldChange(input.field, e.target.value)
                  }
                  onBlur={() => handleBlur(input.field)}
                  onClick={input.field === "endDate" ? handleEndDateClick : undefined}
                  className={`p-2 outline-none border rounded-md w-full font-thin text-xs lg:text-sm shadow-sm ${errors[input.field] && "border-red-500"
                    }`}
                  placeholder={`Enter ${input.label.toLowerCase()}`}
                  min={input.field === "startDate" ? new Date().toISOString().split('T')[0] : undefined}
                  readOnly={input.readOnly}
                />
                {errors[input.field] && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <BiErrorAlt />{" "}
                    <p className=" text-xs font-thin text-red-500">
                      {errors[input.field]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            <label className="mt-6 block text-xs lg:text-sm font-light text-gray-600 mb-2">
              Package description
            </label>
            <textarea
              value={packageDetails.packageDescription}
              onChange={(e) =>
                handleFieldChange("packageDescription", e.target.value)
              }
              onBlur={() => handleBlur("packageDescription")}
              className="p-2 outline-none border rounded-md lg:w-full w-full font-thin text-xs lg:text-sm shadow-sm"
              placeholder="Enter package description to attract customers"
              rows="4"
            ></textarea>
            {errors.packageDescription && (
              <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <BiErrorAlt />{" "}
                <p className="text-xs font-thin text-red-500">
                  {errors.packageDescription}
                </p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
              Is this package open for flexible dates?
            </label>
            <div className="flex items-center">
              <input
                type="radio"
                id="yes"
                name="flexibleDates"
                value="yes"
                checked={packageDetails.flexibleDates}
                onChange={() => handleFieldChange("flexibleDates", true)}
                className="mr-2"
                style={{ accentColor: "#00936C" }}
              />
              <label htmlFor="yes" className="mr-4">
                Yes
              </label>
              <input
                type="radio"
                id="no"
                name="flexibleDates"
                value="no"
                checked={!packageDetails.flexibleDates}
                onChange={() => handleFieldChange("flexibleDates", false)}
                className="mr-2"
                style={{ accentColor: "#00936C" }}
              />
              <label htmlFor="no">No</label>
            </div>
          </div>
          <div className="mt-4 w-1/2">
            <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
              Package validity
            </label>
            <input
              type="date"
              value={
                packageDetails.flexibleDates
                  ? packageDetails.packageValidity
                  : packageDetails.endDate
              }
              onChange={(e) =>
                handleFieldChange("packageValidity", e.target.value)
              }
              onBlur={() =>
                validateField("packageValidity", packageDetails.packageValidity)
              }
              className={`p-2 outline-none border rounded-md w-full font-thin text-xs lg:text-sm shadow-sm ${errors.packageValidity && "border-red-500"
                }`}
              placeholder="Enter package validity"
              min={packageDetails.endDate || today}
              disabled={!packageDetails.flexibleDates}
            />
            {errors.packageValidity && (
              <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <BiErrorAlt />{" "}
                <p className="text-xs font-thin text-red-500">
                  {errors.packageValidity}
                </p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
              Please mark included services
            </label>
            <div className="lg:flex lg:flex-wrap grid grid-cols-2 gap-x-6 gap-y-2">
              {["Visa", "Airport Reception", "Tour Guide", "Insurance", "Breakfast", "Lunch", "Dinner"].map(
                (service) => (
                  <ServiceCheckbox
                    key={service}
                    service={service}
                    isChecked={packageDetails.services.includes(service)}
                    onChange={toggleService}
                  />
                )
              )}
            </div>
          </div>
          {apiError && (
            <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <BiErrorAlt /> <p className="text-red-500 text-xs ">{apiError}</p>{" "}
            </div>
          )}
        </div>
        <button
          onClick={handleContinue}
          disabled={loading}
          className={`mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs lg:text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full ${loading && "cursor-not-allowed"
            }`}
        >
          <span className="flex items-center">
            <span className="mr-1">Continue</span>
            {loading && <ClipLoader size={14} color={"#fff"} />}
          </span>
        </button>
      </div>
      <div className="mt-4 lg:mt-0 lg:w-[25%] h-1/4 p-4 bg-[#E6F4F0] rounded-lg border border-green-200 shadow-sm">
        <p className="text-xs text-gray-600">
          Please ensure that the information you provide is accurate and carefully considered. HUZ Solutions will verify the data submitted during registration prior to listing your company on the platform.{" "}
        </p>
      </div>
    </div>
  );
};

export default BasicInfoForm;
