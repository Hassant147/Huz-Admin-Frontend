import React, { useState, useEffect } from "react";
import { enrollPackageBasicDetail } from "../../../../utility/Api";
import ClipLoader from "../../../../components/loader";
import { BiErrorAlt } from "react-icons/bi";

const MAX_NIGHTS = 999; // Maximum number of nights allowed

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

const BasicInfoForm = ({ formData, onChange, onNextTab }) => {
  const [packageDetails, setPackageDetails] = useState({
    packageName: formData?.packageName || "",
    packageCost: formData?.packageCost || "",
    packageCostForChild: formData?.packageCostForChild || "",
    packageCostForInfants: formData?.packageCostForInfants || "",
    nightsInMecca: formData?.nightsInMecca || "",
    nightsInMadinah: formData?.nightsInMadinah || "",
    startDate: formData?.startDate || "",
    endDate: formData?.endDate || "",
    packageDescription: formData?.packageDescription || "",
    flexibleDates: formData?.flexibleDates || false,
    packageEndBookingDate: formData?.packageEndBookingDate || "",
    services: formData?.services || [],
  });

  useEffect(() => {
    localStorage.setItem("basicDetails", JSON.stringify(packageDetails));
  }, [packageDetails]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const calculateEndDate = (startDate, nightsInMecca, nightsInMadinah) => {
    if (!startDate || !nightsInMecca || !nightsInMadinah) return "";
    const totalNights = parseInt(nightsInMecca) + parseInt(nightsInMadinah);
    const startDateObj = new Date(startDate);
    startDateObj.setDate(startDateObj.getDate() + totalNights);
    return startDateObj.toISOString().split("T")[0];
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

    const updatedDetails = { ...packageDetails, [field]: value };
    if (
      field === "startDate" ||
      field === "nightsInMecca" ||
      field === "nightsInMadinah"
    ) {
      const endDate = calculateEndDate(
        updatedDetails.startDate,
        updatedDetails.nightsInMecca,
        updatedDetails.nightsInMadinah
      );
      updatedDetails.endDate = endDate;
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
      const { partner_session_token } = JSON.parse(
        localStorage.getItem("SignedUp-User-Profile")
      );

      const apiData = {
        partner_session_token,
        package_type: packageType,
        package_name: packageDetails.packageName,
        package_cost: parseFloat(packageDetails.packageCost),
        package_cost_for_child: parseFloat(packageDetails.packageCostForChild),
        package_cost_for_infants: parseFloat(
          packageDetails.packageCostForInfants
        ),
        mecca_nights: parseInt(packageDetails.nightsInMecca),
        madinah_nights: parseInt(packageDetails.nightsInMadinah),
        start_date: new Date(packageDetails.startDate).toISOString(),
        end_date: new Date(packageDetails.endDate).toISOString(),
        description: packageDetails.packageDescription,
        ...mapServicesToApiFields(packageDetails.services),
        is_package_open_for_other_date: packageDetails.flexibleDates,
        package_end_booking_date: packageDetails.packageEndBookingDate,
      };

      try {
        const response = await enrollPackageBasicDetail(apiData);
        localStorage.setItem("huz_token", response.huz_token);
        onNextTab();
      } catch (error) {
        setApiError(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
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

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 font-sans text-xs lg:text-sm">
      <div className="space-y-6 lg:w-3/4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Package name", field: "packageName" },
              { label: "Package cost", field: "packageCost", type: "number" },
              {
                label: "Package cost for child",
                field: "packageCostForChild",
                type: "number",
              },
              {
                label: "Package cost for infants",
                field: "packageCostForInfants",
                type: "number",
              },
              {
                label: "Nights in Mecca",
                field: "nightsInMecca",
                type: "number",
              },
              {
                label: "Nights in Madinah",
                field: "nightsInMadinah",
                type: "number",
              },
              { label: "Start date", field: "startDate", type: "date" },
              {
                label: "End date",
                field: "endDate",
                type: "date",
                disabled: true,
              },
            ].map((input) => (
              <div key={input.field}>
                <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
                  {input.label}
                </label>
                <input
                  type={input.type || "text"}
                  value={packageDetails[input.field]}
                  onChange={(e) =>
                    handleFieldChange(input.field, e.target.value)
                  }
                  onBlur={() => handleBlur(input.field)}
                  className={`p-2 outline-none border rounded-md w-full font-thin text-xs lg:text-sm shadow-sm ${
                    errors[input.field] && "border-red-500"
                  }`}
                  placeholder={`Enter ${input.label.toLowerCase()}`}
                  min={
                    input.type === "date" && input.field === "startDate"
                      ? new Date().toISOString().split("T")[0]
                      : undefined
                  }
                  disabled={input.disabled}
                />
                {errors[input.field] && (
                  <div
                    className="text-red-500 text-xs flex items-center
       gap-1 mt-1"
                  >
                    <BiErrorAlt />{" "}
                    <p className="text-xs font-thin text-red-500">
                      {errors[input.field]}
                    </p>
                  </div>
                )}
                {input.field === "endDate" && (
                  <div className="text-gray-600 text-xs mt-1">
                    The end date is automatically calculated based on the start
                    date and total nights.
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
              <div
                className="text-red-500 text-xs flex items-center
           gap-1 mt-1"
              >
                <BiErrorAlt />
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
          {packageDetails.flexibleDates && (
            <div className="mt-4 w-1/2">
              <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
                Package end booking date
              </label>
              <input
                type="date"
                value={packageDetails.packageEndBookingDate}
                onChange={(e) =>
                  handleFieldChange("packageEndBookingDate", e.target.value)
                }
                onBlur={() => handleBlur("packageEndBookingDate")}
                className={`p-2 outline-none border rounded-md w-full font-thin text-xs lg:text-sm shadow-sm ${
                  errors.packageEndBookingDate && "border-red-500"
                }`}
                placeholder="Enter package end booking date"
                min={packageDetails.endDate || today}
              />
              {errors.packageEndBookingDate && (
                <div
                  className="text-red-500 text-xs flex items-center
                     gap-1 mt-1"
                >
                  <BiErrorAlt />{" "}
                  <p className="text-xs font-thin text-red-500">
                    {errors.packageEndBookingDate}
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="mt-4">
            <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
              Please mark included services
            </label>
            <div className="lg:flex lg:flex-wrap grid grid-cols-2 gap-x-6 gap-y-2">
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
            <div
              className="text-red-500 text-xs flex items-center
       gap-1 mt-1"
            >
              <BiErrorAlt /> <p className="text-red-500 text-xs">{apiError}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleContinue}
          disabled={loading}
          className={`mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs lg:text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full ${
            loading && "cursor-not-allowed"
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
          during registration prior to listing your company on the platform.{" "}
        </p>
      </div>
    </div>
  );
};

export default BasicInfoForm;
