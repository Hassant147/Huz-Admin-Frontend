import React, { useState, useEffect, useRef } from "react";
import {
  enrollPackageBasicDetail,
  editPackageBasicDetail,
} from "../../../../utility/Api";
import ClipLoader from "../../../../components/loader";
import { BiErrorAlt } from "react-icons/bi";

const MAX_NIGHTS = 999;
const MAX_COST_LENGTH = 10;

const ServiceCheckbox = ({ service, isChecked, onChange }) => (
  <div className="flex text-gray-600 items-center font-thin mr-4 text-xs lg:text-sm">
    <input
      type="checkbox"
      id={service}
      checked={isChecked}
      onChange={() => onChange(service)}
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const initialStateSet = useRef(false);

  useEffect(() => {
    if (!initialStateSet.current) {
      const savedData = localStorage.getItem("basicDetails");
      if (savedData) {
        setPackageDetails(JSON.parse(savedData));
      }
      initialStateSet.current = true;
    }
  }, []);

  useEffect(() => {
    if (isEditing && formData && !initialStateSet.current) {
      const initialData = {
        packageName: formData.package_name || "",
        packageBaseCost: formData.package_base_cost || "",
        packageCostForChild: formData.cost_for_child || "",
        packageCostForInfants: formData.cost_for_infants || "",
        packageCostForSharing: formData.cost_for_sharing || "",
        packageCostForQuad: formData.cost_for_quad || "",
        packageCostForTriple: formData.cost_for_triple || "",
        packageCostForDouble: formData.cost_for_double || "",
        packageCostForSingle: formData.cost_for_single || "",
        nightsInMecca: formData.mecca_nights || "",
        nightsInMadinah: formData.madinah_nights || "",
        startDate: formData.start_date ? formData.start_date.split("T")[0] : "",
        endDate: formData.end_date ? formData.end_date.split("T")[0] : "",
        packageDescription: formData.description || "",
        flexibleDates: formData.is_package_open_for_other_date || false,
        packageValidity: formData.package_validity
          ? formData.package_validity.split("T")[0]
          : "",
        services: [
          ...(formData.is_visa_included ? ["Visa"] : []),
          ...(formData.is_airport_reception_included
            ? ["Airport Reception"]
            : []),
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

  const handleFieldChange = (field, value) => {
    if (value.length > MAX_COST_LENGTH && field.includes("Cost")) return;
    if (value.length > 3 && field.includes("nights")) return;
    setPackageDetails((prev) => {
      const updatedDetails = { ...prev, [field]: value };
      if (field === "flexibleDates") {
        updatedDetails.packageValidity = value ? "" : packageDetails.endDate;
      }
      validateField(field, value);
      onChange(updatedDetails);
      return updatedDetails;
    });
  };

  const validateField = (field, value) => {
    let error = "";
    if (typeof value === "string" && !value.trim()) {
      error = `${field.replace(/([A-Z])/g, " $1").trim()} is required`;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
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
    if (validateForm()) {
      setLoading(true);
      setApiError("");

      const packageType = localStorage.getItem("package_type") || "Hajj";
      const { partner_session_token } = JSON.parse(
        localStorage.getItem("SignedUp-User-Profile")
      );
      const huzToken = localStorage.getItem("huz_token");

      const commonData = {
        partner_session_token,
        package_name: packageDetails.packageName,
        package_base_cost: parseFloat(
          packageDetails.packageBaseCost.replace(/,/g, "")
        ),
        cost_for_child: parseFloat(
          packageDetails.packageCostForChild.replace(/,/g, "")
        ),
        cost_for_infants: parseFloat(
          packageDetails.packageCostForInfants.replace(/,/g, "")
        ),
        cost_for_sharing: parseFloat(
          packageDetails.packageCostForSharing.replace(/,/g, "")
        ),
        cost_for_quad: parseFloat(
          packageDetails.packageCostForQuad.replace(/,/g, "")
        ),
        cost_for_triple: parseFloat(
          packageDetails.packageCostForTriple.replace(/,/g, "")
        ),
        cost_for_double: parseFloat(
          packageDetails.packageCostForDouble.replace(/,/g, "")
        ),
        cost_for_single: parseFloat(
          packageDetails.packageCostForSingle.replace(/,/g, "")
        ),
        mecca_nights: parseInt(packageDetails.nightsInMecca),
        madinah_nights: parseInt(packageDetails.nightsInMadinah),
        start_date: new Date(packageDetails.startDate).toISOString(),
        end_date: new Date(packageDetails.endDate).toISOString(),
        description: packageDetails.packageDescription,
        ...mapServicesToApiFields(packageDetails.services),
        is_package_open_for_other_date: packageDetails.flexibleDates,
        package_validity: packageDetails.packageValidity
          ? new Date(packageDetails.packageValidity).toISOString()
          : new Date(packageDetails.endDate).toISOString(),
      };

      try {
        const response = isEditing
          ? await editPackageBasicDetail({ ...commonData, huz_token: huzToken })
          : await enrollPackageBasicDetail({
            ...commonData,
            package_type: packageType,
          });
        if (!isEditing) {
          localStorage.setItem("huz_token", response.huz_token);
        }
        onNextTab(response);
      } catch (error) {
        setApiError(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  const formatNumberWithCommas = (number) =>
    number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleCostChange = (field, value) => {
    const rawValue = value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue)) {
      handleFieldChange(field, formatNumberWithCommas(rawValue));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(packageDetails).forEach((key) => {
      const value = packageDetails[key];
      if (typeof value === "string" && value.trim() === "") {
        if (key !== "packageValidity" || packageDetails.flexibleDates) {
          newErrors[key] = `${key.replace(/([A-Z])/g, " $1").trim()} is required`;
          isValid = false;
        }
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

  const calculateEndDate = () => {
    const { startDate, nightsInMecca, nightsInMadinah } = packageDetails;
    if (startDate && nightsInMecca && nightsInMadinah) {
      const totalNights = parseInt(nightsInMecca) + parseInt(nightsInMadinah);
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + totalNights);
      return end.toISOString().split("T")[0];
    }
    return "";
  };

  useEffect(() => {
    const endDate = calculateEndDate();
    if (endDate) {
      setPackageDetails((prev) => ({ ...prev, endDate }));
    }
  }, [
    packageDetails.startDate,
    packageDetails.nightsInMecca,
    packageDetails.nightsInMadinah,
  ]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 font-sans text-xs lg:text-sm">
      <div className="space-y-6 lg:w-3/4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Package name", field: "packageName" },
              { label: "Package base cost", field: "packageBaseCost" },
              { label: "Cost for child", field: "packageCostForChild" },
              { label: "Cost for infants", field: "packageCostForInfants" },
              { label: "Cost for sharing", field: "packageCostForSharing" },
              { label: "Cost for quad", field: "packageCostForQuad" },
              { label: "Cost for triple", field: "packageCostForTriple" },
              { label: "Cost for double", field: "packageCostForDouble" },
              { label: "Cost for single", field: "packageCostForSingle" },
              { label: "Nights in Mecca", field: "nightsInMecca", type: "number" },
              { label: "Nights in Madinah", field: "nightsInMadinah", type: "number" },
              { label: "Start date", field: "startDate", type: "date", min: today },
              { label: "End date", field: "endDate", type: "date" },
            ].map(({ label, field, type, min }) => (
              <div key={field}>
                <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
                  {label}
                </label>
                <input
                  type={type || "text"}
                  value={packageDetails[field]}
                  onChange={(e) =>
                    field.includes("Cost")
                      ? handleCostChange(field, e.target.value)
                      : handleFieldChange(field, e.target.value)
                  }
                  onBlur={() => validateField(field, packageDetails[field])}
                  className={`p-2 outline-none border rounded-md w-full font-thin text-xs lg:text-sm shadow-sm ${errors[field] ? "border-red-500" : ""
                    }`}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  disabled={field === "endDate"}
                  min={min}
                />
                {errors[field] && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <BiErrorAlt />{" "}
                    <p className="text-xs font-thin text-red-500">
                      {errors[field]}
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
              onBlur={() =>
                validateField(
                  "packageDescription",
                  packageDetails.packageDescription
                )
              }
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
              className={`p-2 outline-none border rounded-md w-full font-thin text-xs lg:text-sm shadow-sm ${errors.packageValidity ? "border-red-500" : ""
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
            <div className="lg:flex lg:flex-wrap grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                "Visa",
                "Airport Reception",
                "Tour Guide",
                "Insurance",
                "Breakfast",
                "Lunch",
                "Dinner",
              ].map((service) => (
                <ServiceCheckbox
                  key={service}
                  service={service}
                  isChecked={packageDetails.services.includes(service)}
                  onChange={toggleService}
                />
              ))}
            </div>
          </div>
          {apiError && (
            <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <BiErrorAlt /> <p className="text-red-500 text-xs">{apiError}</p>
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
          Please ensure that the information you provide is accurate and
          carefully considered. HUZ Solutions will verify the data submitted
          during registration prior to listing your company on the platform.
        </p>
      </div>
    </div>
  );
};

export default BasicInfoForm;
