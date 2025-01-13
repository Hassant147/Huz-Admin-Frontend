import React, { useState, useEffect } from "react";
import Select from "react-select";
import countries from "country-json/src/country-by-name.json"; // Ensure this path is correct
import { updateCompanyAddress, getCompanyAddress } from "../../../utility/Api"; // Ensure this path is correct
import Loader from "../../../components/loader";
import { BiErrorAlt } from "react-icons/bi";
import { Toaster } from "react-hot-toast";

const CompanyAddress = () => {
  const [formData, setFormData] = useState({
    streetAddress: "",
    addressLine2: "",
    countryRegion: "",
    city: "",
    state: "",
    postalCode: "",
    address_id: "", // Add this field for address_id
  });
  const [initialData, setInitialData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true); // New state for fetching loader

  useEffect(() => {
    const fetchAddressData = async () => {
      const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
      if (profile) {
        const partnerSessionToken = profile.partner_session_token;
        try {
          const addressData = await getCompanyAddress(partnerSessionToken);
          if (addressData.length > 0) {
            const address = addressData[0];
            const initialAddressData = {
              streetAddress: address.street_address || "",
              addressLine2: address.address_line2 || "",
              countryRegion: address.country || "",
              city: address.city || "",
              state: address.state || "",
              postalCode: address.postal_code || "",
              address_id: address.address_id || "",
            };
            setFormData(initialAddressData);
            setInitialData(initialAddressData);
          }
        } catch (error) {
          console.error("Error fetching address data:", error);
        } finally {
          setFetchingData(false); // Stop the loader once data is fetched
        }
      } else {
        setFetchingData(false); // Stop the loader if no profile is found
      }
    };

    fetchAddressData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      countryRegion: selectedOption ? selectedOption.value : "",
    });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleValidation = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== "addressLine2" && key !== "state") {
        newErrors[key] = capitalizeFirstLetter(`${key} is required`);
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (!formData[name] && name !== "addressLine2" && name !== "state") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name} is required`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    setSubmitLoading(true);
    try {
      const { partner_session_token } = JSON.parse(
        localStorage.getItem("SignedUp-User-Profile")
      );
      const updatedAddress = await updateCompanyAddress(
        formData,
        partner_session_token
      );

      // Save updated address in localStorage
      const updatedProfile = JSON.parse(
        localStorage.getItem("SignedUp-User-Profile")
      );
      updatedProfile.address = updatedAddress;
      localStorage.setItem(
        "SignedUp-User-Profile",
        JSON.stringify(updatedProfile)
      );

      // Update formData and initialData with the new address data
      const newAddressData = {
        streetAddress: updatedAddress.street_address || "",
        addressLine2: updatedAddress.address_line2 || "",
        countryRegion: updatedAddress.country || "",
        city: updatedAddress.city || "",
        state: updatedAddress.state || "",
        postalCode: updatedAddress.postal_code || "",
        address_id: updatedAddress.address_id || "",
      };
      setFormData(newAddressData);
      setInitialData(newAddressData);

      alert("Address updated successfully!");
    } catch (error) {
      console.error("Error updating address:", error);
      setFormData(initialData);
      alert("Failed to update address. Reverting to previous values.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader
          type="spinner-cub"
          bgColor="#00936c"
          color="#00936c"
          size={30}
        />
      </div>
    );
  }

  const countryOptions = countries.map((country) => ({
    value: country.country,
    label: country.country,
  }));

  return (
    <div className="">
      <div className="lg:flex lg:space-x-4">
        <form onSubmit={handleSubmit} className="mx-auto lg:w-full">
          <div className="bg-white p-8 rounded-md shadow-md flex flex-col lg:flex-row justify-between">
            <div className="lg:w-1/2">
              <div className="mb-4 lg:mr-4 lg:w-full">
                <label
                  className="block text-gray-700 text-xs font-light mb-2"
                  htmlFor="streetAddress"
                >
                  Street address
                </label>
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 123 easy street"
                  className="p-2 outline-none border rounded-md w-full font-thin text-sm shadow-sm"
                />
                {errors.streetAddress && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <BiErrorAlt />
                    <p className="text-red-600 text-xs">
                      {errors.streetAddress}
                    </p>
                  </div>
                )}
              </div>
              <div className="mb-4 lg:w-full lg:mr-4">
                <label
                  className="block text-gray-700 text-xs font-light mb-2"
                  htmlFor="addressLine2"
                >
                  Address line 2
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Unit number, suite, floor, building, etc."
                  className="p-2 outline-none border rounded-md w-full font-thin text-sm shadow-sm"
                />
              </div>
              <div className="mb-4 lg:w-full lg:mr-4">
                <label
                  className="block text-gray-700 text-xs font-light mb-2"
                  htmlFor="countryRegion"
                >
                  Country/region
                </label>
                <Select
                  id="countryRegion"
                  name="countryRegion"
                  value={countryOptions.find(
                    (option) => option.value === formData.countryRegion
                  )}
                  onChange={handleSelectChange}
                  onBlur={() =>
                    handleBlur({ target: { name: "countryRegion" } })
                  }
                  options={countryOptions}
                  className={`react-select-container w-full shadow-sm text-sm text-[#4b465c] ${
                    errors.countryRegion ? "border-red-500" : "border-gray-200"
                  }`}
                  classNamePrefix="react-select"
                />
                {errors.countryRegion && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <BiErrorAlt />
                    <p className="text-red-600 text-xs">
                      {errors.countryRegion}
                    </p>
                  </div>
                )}
              </div>
              <div className="mb-4 lg:w-full lg:mr-4">
                <label
                  className="block text-gray-700 text-xs font-light mb-2"
                  htmlFor="city"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. New York"
                  className="p-2 outline-none border rounded-md w-full font-thin text-sm shadow-sm"
                />
                {errors.city && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <BiErrorAlt />
                    <p className="text-red-600 text-xs">{errors.city}</p>
                  </div>
                )}
              </div>
              <div className="mb-4 lg:w-full lg:mr-4">
                <label
                  className="block text-gray-700 text-xs font-light mb-2"
                  htmlFor="state"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="p-2 border outline-none rounded-md w-full font-thin text-sm shadow-sm"
                />
              </div>
              <div className="mb-4 lg:w-full lg:mr-4">
                <label
                  className="block text-gray-700 text-xs font-light mb-2"
                  htmlFor="postalCode"
                >
                  Postal code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="p-2 outline-none border rounded-md w-full font-thin text-sm shadow-sm"
                />
                {errors.postalCode && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <BiErrorAlt />
                    <p className="text-red-600 text-xs">{errors.postalCode}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="border mt-4 lg:mt-6 lg:w-1/3 h-1/4 p-4 bg-[#F6F6F6] rounded-md shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Your address matters
              </h2>
              <p className="text-xs text-gray-700">
                Please provide your complete company address, including building
                name and number, as we may verify this information.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
              disabled={submitLoading}
            >
              {submitLoading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Update Address Detail
            </button>
          </div>
        </form>
      </div>
      {/* <Toaster /> */}
    </div>
  );
};

export default CompanyAddress;
