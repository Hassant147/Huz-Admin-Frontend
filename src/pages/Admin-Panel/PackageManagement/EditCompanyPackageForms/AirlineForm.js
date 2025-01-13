import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import cities from "../../../../cities.json";
import {
  enrollPackageAirlineDetail,
  editPackageAirlineDetail,
} from "../../../../utility/Api";
import ClipLoader from "../../../../components/loader";
import { BiErrorAlt } from "react-icons/bi";

const airlines = [
  { value: "Saudia", label: "Saudia" },
  {
    value: "Pakistan International Airlines",
    label: "Pakistan International Airlines",
  },
  { value: "Flynas", label: "Flynas" },
  { value: "Airblue", label: "Airblue" },
  { value: "Gulf Air", label: "Gulf Air" },
  { value: "Emirates", label: "Emirates" },
  { value: "Qatar Airways", label: "Qatar Airways" },
];

const ticketTypes = [
  { value: "Economy", label: "Economy" },
  { value: "Business", label: "Business" },
  { value: "First Class", label: "First Class" },
];

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "0.375rem",
    padding: "0.25rem 0.5rem",
    borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
    "&:hover": {
      borderColor: "#2563eb",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.375rem",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "0.875rem",
    color: "#1f2937",
  }),
  input: (provided) => ({
    ...provided,
    fontSize: "0.875rem",
    color: "#1f2937",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "0.875rem",
    color: "#9ca3af",
  }),
};

const FlightInfoForm = ({ formData, onChange, onNextTab, isEditing }) => {
  const [flightDetails, setFlightDetails] = useState({
    airline: "",
    ticketType: "",
    returnFlightIncluded: false,
    originCity: "",
    returnCity: "",
  });

  const [airlineSuggestions, setAirlineSuggestions] = useState([]);
  const [originCitySuggestions, setOriginCitySuggestions] = useState([]);
  const [returnCitySuggestions, setReturnCitySuggestions] = useState([]);

  const initialStateSet = useRef(false);
  const originCityRef = useRef(null);
  const returnCityRef = useRef(null);

  useEffect(() => {
    if (!initialStateSet.current && isEditing && formData) {
      const airlineDetail = formData.airline_detail?.[0] || {};
      setFlightDetails({
        airline: airlineDetail.airline_name || "",
        ticketType: airlineDetail.ticket_type || "",
        returnFlightIncluded: airlineDetail.is_return_flight_included || false,
        originCity: airlineDetail.flight_from || "",
        returnCity: airlineDetail.flight_to || "",
      });
      initialStateSet.current = true;
    }
  }, [isEditing, formData]);

  useEffect(() => {
    localStorage.setItem("flightDetails", JSON.stringify(flightDetails));
  }, [flightDetails]);

  const [errors, setErrors] = useState({
    airline: "",
    ticketType: "",
    originCity: "",
    returnCity: "",
  });

  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const validateField = (name, value) => {
    const formattedName =
      name === "returnCity"
        ? "Return City"
        : name === "originCity"
        ? "Origin City"
        : name === "ticketType"
        ? "Ticket Type"
        : name;

    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [name]: capitalizeFirstLetter(`${formattedName} is required`),
      }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return true;
    }
  };

  const handleFieldChange = (field, value) => {
    const updatedDetails = { ...flightDetails, [field]: value };
    setFlightDetails(updatedDetails);
    validateField(field, value);
    onChange(updatedDetails);

    if (field === "originCity") {
      if (value) {
        setOriginCitySuggestions(
          cities.filter((city) =>
            city.name.toLowerCase().includes(value.toLowerCase())
          )
        );
      } else {
        setOriginCitySuggestions([]);
      }
    } else if (field === "returnCity") {
      if (value) {
        setReturnCitySuggestions(
          cities.filter((city) =>
            city.name.toLowerCase().includes(value.toLowerCase())
          )
        );
      } else {
        setReturnCitySuggestions([]);
      }
    }
  };

  const handleBlur = (field) => {
    const value = flightDetails[field];
    validateField(field, value);
  };

  const handleContinue = async () => {
    const isAirlineValid = validateField("airline", flightDetails.airline);
    const isTicketTypeValid = validateField(
      "ticketType",
      flightDetails.ticketType
    );
    const isOriginCityValid = validateField(
      "originCity",
      flightDetails.originCity
    );
    const isReturnCityValid = validateField(
      "returnCity",
      flightDetails.returnCity
    );

    if (
      isAirlineValid &&
      isTicketTypeValid &&
      isOriginCityValid &&
      isReturnCityValid
    ) {
      const huzToken = isEditing
        ? formData.huz_token
        : localStorage.getItem("huz_token");
      const { partner_session_token } = JSON.parse(
        localStorage.getItem("SignedUp-User-Profile")
      );

      const apiData = {
        partner_session_token,
        huz_token: huzToken,
        airline_name: flightDetails.airline,
        ticket_type: flightDetails.ticketType,
        is_return_flight_included: true,
        flight_from: flightDetails.originCity,
        flight_to: flightDetails.returnCity,
      };

      setLoading(true);
      setApiError("");
      let response;
      try {
        if (isEditing) {
          response = await editPackageAirlineDetail(apiData);
          localStorage.setItem("packageDetail", JSON.stringify(response));
          onNextTab(response); // Pass the updated data to the parent component
        } else {
          const response = await enrollPackageAirlineDetail(apiData);
          localStorage.setItem("packageDetail", JSON.stringify(response));
        }
        onNextTab(response); // Pass the updated data to the parent component
      } catch (error) {
        setApiError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (
      originCityRef.current &&
      !originCityRef.current.contains(event.target) &&
      returnCityRef.current &&
      !returnCityRef.current.contains(event.target)
    ) {
      setOriginCitySuggestions([]);
      setReturnCitySuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 font-sans text-xs lg:text-sm">
      <div className="space-y-6 lg:w-3/4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
                Airline
              </label>
              <Select
                value={airlines.find(
                  (option) => option.value === flightDetails.airline
                )}
                onChange={(option) =>
                  handleFieldChange("airline", option?.value)
                }
                options={airlines}
                styles={customSelectStyles}
                classNamePrefix="react-select"
              />
              {errors.airline && (
                <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <BiErrorAlt />
                  <p className="text-red-500 text-xs">{errors.airline}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
                Ticket type
              </label>
              <Select
                value={ticketTypes.find(
                  (option) => option.value === flightDetails.ticketType
                )}
                onChange={(option) =>
                  handleFieldChange("ticketType", option?.value)
                }
                options={ticketTypes}
                styles={customSelectStyles}
                classNamePrefix="react-select"
              />
              {errors.ticketType && (
                <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <BiErrorAlt />
                  <p className="text-red-500 text-xs">{errors.ticketType}</p>
                </div>
              )}
            </div>
            <div className="relative" ref={originCityRef}>
              <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
                Flight origin city
              </label>
              <input
                type="text"
                value={flightDetails.originCity}
                onChange={(e) =>
                  handleFieldChange("originCity", e.target.value)
                }
                onBlur={() => handleBlur("originCity")}
                className={`p-2 outline-none border rounded-md w-full font-thin text-xs lg:text-sm shadow-sm ${
                  errors.originCity && "border-red-500"
                }`}
                placeholder="Enter flight origin city"
              />
              {errors.originCity && (
                <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <BiErrorAlt />
                  <p className="text-xs font-thin text-red-500">
                    {errors.originCity}
                  </p>
                </div>
              )}
              {originCitySuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {originCitySuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        handleFieldChange("originCity", suggestion.name);
                        setOriginCitySuggestions([]);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative" ref={returnCityRef}>
              <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
                Flight return city
              </label>
              <input
                type="text"
                value={flightDetails.returnCity}
                onChange={(e) =>
                  handleFieldChange("returnCity", e.target.value)
                }
                onBlur={() => handleBlur("returnCity")}
                className={`p-2 outline-none border rounded-md w-full font-thin text-xs lg:text-sm shadow-sm ${
                  errors.returnCity && "border-red-500"
                }`}
                placeholder="Enter flight return city"
              />
              {errors.returnCity && (
                <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <BiErrorAlt />
                  <p className="text-xs font-thin text-red-500">
                    {errors.returnCity}
                  </p>
                </div>
              )}
              {returnCitySuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {returnCitySuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        handleFieldChange("returnCity", suggestion.name);
                        setReturnCitySuggestions([]);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* <div className="mt-4">
            <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
              Return flight included?
            </label>
            <div className="flex items-center">
              <input
                type="radio"
                id="yes"
                name="returnFlightIncluded"
                value="yes"
                style={{ accentColor: "#00936C" }}
                checked={flightDetails.returnFlightIncluded === true}
                onChange={() => handleFieldChange("returnFlightIncluded", true)}
                className="mr-2"
              />
              <label htmlFor="yes" className="mr-4">
                Yes
              </label>
              <input
                type="radio"
                id="no"
                name="returnFlightIncluded"
                value="no"
                style={{ accentColor: "#00936C" }}
                checked={flightDetails.returnFlightIncluded === false}
                onChange={() =>
                  handleFieldChange("returnFlightIncluded", false)
                }
                className="mr-2"
              />
              <label htmlFor="no">No</label>
            </div>
          </div> */}
          {apiError && (
            <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
              <BiErrorAlt />
              <p className="text-red-500 text-xs">{apiError}</p>
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
          during registration prior to listing your company on the platform.
        </p>
      </div>
    </div>
  );
};

export default FlightInfoForm;
