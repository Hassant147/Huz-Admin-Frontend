import React, { useState, useEffect } from "react";
import { enrollPackageTransportDetail } from "../../../../utility/Api";
import Loader from "../../../../components/loader";
import ClipLoader from "../../../../components/loader";
import Select from "react-select";
import { BiErrorAlt } from "react-icons/bi";

const transportOptions = [
  { value: "Bus", label: "Bus" },
  { value: "Car", label: "Car" },
  { value: "Taxi", label: "Taxi" },
  { value: "Van", label: "Van" },
  { value: "Minibus", label: "Minibus" },
];

const transportTypeOptions = [
  { value: "", label: "Select Type" },
  { value: "Private", label: "Private" },
  { value: "Shared", label: "Shared" },
];

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    fontSize: "0.75rem", // Adjust the font size here
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
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#00936C" : "inherit", // Set the background color for selected option
  }),
};

const TransportForm = ({ formData, onChange, onNextTab }) => {
  const [transportDetails, setTransportDetails] = useState({
    transport: formData?.transport || "",
    type: formData?.type || "",
    routes: formData?.routes || [],
  });

  const [errors, setErrors] = useState({
    transport: "",
    type: "",
    routes: "",
  });

  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("transportDetails", JSON.stringify(transportDetails));
  }, [transportDetails]);

  const validateField = (name, value) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [name]: `${name} is required` }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return true;
    }
  };

  const validateRoutes = (routes) => {
    if (routes.length === 0) {
      setErrors((prev) => ({
        ...prev,
        routes: "At least one route must be selected",
      }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, routes: "" }));
      return true;
    }
  };

  const handleFieldChange = (field, value) => {
    const updatedDetails = { ...transportDetails, [field]: value };
    setTransportDetails(updatedDetails);
    validateField(field, value);
    onChange(updatedDetails);
  };

  const handleRouteChange = (route) => {
    const updatedRoutes = transportDetails.routes.includes(route)
      ? transportDetails.routes.filter((r) => r !== route)
      : [...transportDetails.routes, route];
    setTransportDetails((prev) => ({
      ...prev,
      routes: updatedRoutes,
    }));
    validateRoutes(updatedRoutes);
  };

  const handleContinue = async () => {
    const isTransportValid = validateField(
      "transport",
      transportDetails.transport
    );
    const isTypeValid = validateField("type", transportDetails.type);
    const areRoutesValid = validateRoutes(transportDetails.routes);

    if (isTransportValid && isTypeValid && areRoutesValid) {
      const { partner_session_token } = JSON.parse(
        localStorage.getItem("SignedUp-User-Profile")
      );
      const huzToken = localStorage.getItem("huz_token");

      const apiData = {
        partner_session_token,
        huz_token: huzToken,
        transport_name: transportDetails.transport,
        transport_type: transportDetails.type,
        routes: transportDetails.routes.join(", "),
      };

      setLoading(true);
      setApiError("");

      try {
        await enrollPackageTransportDetail(apiData);
        onNextTab();
      } catch (error) {
        setApiError(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 font-sans text-xs lg:text-sm">
      <div className="space-y-6 lg:w-3/4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-light text-gray-600 mb-2">
                Transport
              </label>
              <Select
                value={transportOptions.find(
                  (option) => option.value === transportDetails.transport
                )}
                onChange={(option) =>
                  handleFieldChange("transport", option?.value)
                }
                options={transportOptions}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    fontSize: "0.75rem", // Adjust the font size here
                    borderColor: state.isFocused ? "#718096" : "#cbd5e0", // Border color when focused or unfocused
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#00936C" : "inherit", // Set the background color for selected option
                  }),
                }}
                className={`react-select-container ${
                  errors.transport ? "border-red-500" : "border-gray-400"
                }`}
                classNamePrefix="react-select"
              />
              {errors.transport && (
                <div
                  className="text-red-500 text-xs flex items-center
       gap-1 mt-1"
                >
                  <BiErrorAlt />{" "}
                  <p className="text-red-500 text-xs">{errors.transport}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
                Type
              </label>
              <Select
                value={transportTypeOptions.find(
                  (option) => option.value === transportDetails.type
                )}
                onChange={(option) => handleFieldChange("type", option?.value)}
                options={transportTypeOptions}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    fontSize: "0.75rem", // Adjust the font size here
                    borderColor: state.isFocused
                      ? "#718096"
                      : errors.type
                      ? "#e53e3e"
                      : "#cbd5e0", // Border color when focused, with error handling
                    boxShadow: state.isFocused
                      ? "0 0 0 1px #718096"
                      : provided.boxShadow, // Adding shadow on focus
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "#00936C"
                      : state.isFocused
                      ? "#edf2f7"
                      : "inherit", // Set the background color for selected option
                  }),
                }}
                className={`react-select-container ${
                  errors.type ? "border-red-500" : "border-gray-400"
                }`}
                classNamePrefix="react-select"
              />
              {errors.type && (
                <div
                  className="text-red-500 text-xs flex items-center
          gap-1 mt-1"
                >
                  <BiErrorAlt />
                  <p className="text-red-500 text-xs">{errors.type}</p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
              Included route?
            </label>
            <div className="grid grid-cols-2 gap-x-6">
              {[
                "Jeddah to Mecca",
                "Mecca to Madinah",
                "Madinah to Mecca",
                "Mecca to Jeddah",
              ].map((route) => (
                <div
                  key={route}
                  className="flex items-center mb-2 font-thin text-xs lg:text-sm text-gray-500"
                >
                  <input
                    type="checkbox"
                    id={route}
                    checked={transportDetails.routes.includes(route)}
                    onChange={() => handleRouteChange(route)}
                    className="mr-2"
                    style={{ accentColor: "#00936C" }}
                  />
                  <label htmlFor={route}>{route}</label>
                </div>
              ))}
            </div>
            {errors.routes && (
              <div
                className="text-red-500 text-xs flex items-center
          gap-1 mt-1"
              >
                <BiErrorAlt />
                <p className="text-red-500 text-xs">{errors.routes}</p>
              </div>
            )}
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
          className={`mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs lg:text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full ${
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
        <p className="text-xs lg:text-sm text-gray-600">
          Please ensure that the information you provide is accurate and
          carefully considered. Accurate information helps in providing the best
          possible services.
        </p>
      </div>
    </div>
  );
};

export default TransportForm;

// // import React, { useState, useEffect } from 'react';
// import { enrollPackageTransportDetail } from '../../../../utility/Api';
// import ClipLoader from 'react-spinners/ClipLoader';
// import Select from 'react-select';

// const transportOptions = [
//     { value: 'Bus', label: 'Bus' },
//     { value: 'Car', label: 'Car' },
//     { value: 'Taxi', label: 'Taxi' },
//     { value: 'Van', label: 'Van' },
//     { value: 'Minibus', label: 'Minibus' }
// ];

// const transportTypeOptions = [
//     { value: 'Private', label: 'Private' },
//     { value: 'Shared', label: 'Shared' }
// ];

// const customSelectStyles = {
//     control: (provided, state) => ({
//         ...provided,
//         fontSize: '0.75rem',
//         borderRadius: '0.375rem',
//         padding: '0.25rem 0.5rem',
//         borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
//         boxShadow: state.isFocused ? '0 0 0 1px #2563eb' : 'none',
//         '&:hover': {
//             borderColor: '#2563eb',
//         },
//     }),
//     menu: (provided) => ({
//         ...provided,
//         borderRadius: '0.375rem',
//     }),
//     singleValue: (provided) => ({
//         ...provided,
//         fontSize: '0.875rem',
//         color: '#1f2937',
//     }),
//     input: (provided) => ({
//         ...provided,
//         fontSize: '0.875rem',
//         color: '#1f2937',
//     }),
//     placeholder: (provided) => ({
//         ...provided,
//         fontSize: '0.875rem',
//         color: '#9ca3af',
//     }),
//     option: (provided, state) => ({
//         ...provided,
//         backgroundColor: state.isSelected ? '#00936C' : 'inherit',
//     }),
// };

// const TransportForm = ({ formData, onChange, onNextTab }) => {
//     const [transportDetails, setTransportDetails] = useState({
//         transport: formData?.transport_name || '',
//         type: formData?.transport_type || '',
//         routes: Array.isArray(formData?.routes) ? formData.routes : (formData?.routes ? formData.routes.split(', ') : [])
//     });

//     const [errors, setErrors] = useState({
//         transport: '',
//         type: '',
//         routes: ''
//     });

//     const [apiError, setApiError] = useState('');
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         localStorage.setItem('transportDetails', JSON.stringify(transportDetails));
//     }, [transportDetails]);

//     const validateField = (name, value) => {
//         if (!value) {
//             setErrors(prev => ({ ...prev, [name]: `${name} is required` }));
//             return false;
//         } else {
//             setErrors(prev => ({ ...prev, [name]: '' }));
//             return true;
//         }
//     };

//     const validateRoutes = (routes) => {
//         if (routes.length === 0) {
//             setErrors(prev => ({ ...prev, routes: 'At least one route must be selected' }));
//             return false;
//         } else {
//             setErrors(prev => ({ ...prev, routes: '' }));
//             return true;
//         }
//     };

//     const handleFieldChange = (field, value) => {
//         const updatedDetails = { ...transportDetails, [field]: value };
//         setTransportDetails(updatedDetails);
//         validateField(field, value);
//         onChange(updatedDetails);
//     };

//     const handleRouteChange = (route) => {
//         const updatedRoutes = transportDetails.routes.includes(route)
//             ? transportDetails.routes.filter(r => r !== route)
//             : [...transportDetails.routes, route];
//         setTransportDetails(prev => ({
//             ...prev,
//             routes: updatedRoutes
//         }));
//         validateRoutes(updatedRoutes);
//         onChange({ ...transportDetails, routes: updatedRoutes });
//     };

//     const handleContinue = async () => {
//         const isTransportValid = validateField('transport', transportDetails.transport);
//         const isTypeValid = validateField('type', transportDetails.type);
//         const areRoutesValid = validateRoutes(transportDetails.routes);

//         if (isTransportValid && isTypeValid && areRoutesValid) {
//             const { partner_session_token } = JSON.parse(localStorage.getItem('SignedUp-User-Profile'));
//             const huzToken = localStorage.getItem('huz_token');

//             const apiData = {
//                 partner_session_token,
//                 huz_token: huzToken,
//                 transport_name: transportDetails.transport,
//                 transport_type: transportDetails.type,
//                 routes: transportDetails.routes.join(', ')
//             };

//             setLoading(true);
//             setApiError('');

//             try {
//                 const response = await enrollPackageTransportDetail(apiData);
//                 setTransportDetails(response.data);  // Assuming response.data contains the updated transport details
//                 onChange(response.data);  // Update the parent component with the new data
//                 onNextTab();
//             } catch (error) {
//                 setApiError(error.response?.data?.message || 'An error occurred');
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     return (
//         <div className="flex flex-col lg:flex-row lg:space-x-6 font-sans text-xs lg:text-sm">
//             <div className="space-y-6 lg:w-3/4">
//                 <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
//                     <div className="grid grid-cols-2 gap-6">
//                         <div>
//                             <label className="block text-sm font-light text-gray-600 mb-2">Transport</label>
//                             <Select
//                                 value={transportOptions.find(option => option.value === transportDetails.transport)}
//                                 onChange={(option) => handleFieldChange('transport', option?.value)}
//                                 options={transportOptions}
//                                 styles={customSelectStyles}
//                                 className={`react-select-container ${errors.transport ? 'border-red-500' : 'border-gray-400'}`}
//                                 classNamePrefix="react-select"
//                             />
//                             {errors.transport && <p className="text-red-500 text-xs mt-1">{errors.transport}</p>}
//                         </div>

//                         <div>
//                             <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">Type</label>
//                             <Select
//                                 value={transportTypeOptions.find(option => option.value === transportDetails.type)}
//                                 onChange={(option) => handleFieldChange('type', option?.value)}
//                                 options={transportTypeOptions}
//                                 styles={customSelectStyles}
//                                 className={`react-select-container ${errors.type ? 'border-red-500' : 'border-gray-400'}`}
//                                 classNamePrefix="react-select"
//                             />
//                             {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
//                         </div>
//                     </div>
//                     <div className="mt-4">
//                         <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">Included route?</label>
//                         <div className="grid grid-cols-2 gap-x-6 gap-y-2">
//                             {['Jeddah to Mecca', 'Mecca to Madinah', 'Madinah to Mecca', 'Mecca to Jeddah'].map(route => (
//                                 <div key={route} className="flex items-center mb-2 font-thin text-xs lg:text-sm text-gray-500">
//                                     <input
//                                         type="checkbox"
//                                         id={route}
//                                         checked={transportDetails.routes.includes(route)}
//                                         onChange={() => handleRouteChange(route)}
//                                         className="mr-2"
//                                         style={{ accentColor: '#00936C' }}
//                                     />
//                                     <label htmlFor={route}>{route}</label>
//                                 </div>
//                             ))}
//                         </div>
//                         {errors.routes && <p className="text-red-500 text-xs mt-1">{errors.routes}</p>}
//                     </div>
//                     {apiError && <p className="text-red-500 text-xs mt-1">{apiError}</p>}
//                     <button
//                         onClick={handleContinue}
//                         disabled={loading}
//                         className={`mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs lg:text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full ${loading && 'cursor-not-allowed'}`}
//                     >
//                         <span className="flex items-center">
//                             <span className="mr-1">Continue</span>
//                             {loading && <ClipLoader size={14} color={"#fff"} />}
//                         </span>
//                     </button>
//                 </div>
//             </div>
//             <div className="mt-4 lg:mt-0 lg:w-[19.5%] h-1/4 p-4 bg-[#E6F4F0] rounded-lg border border-green-200 shadow-sm">
//                 <p className="text-xs lg:text-sm text-gray-600">
//                     Please ensure that the information you provide is accurate and carefully considered. Accurate information helps in providing the best possible services.
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default TransportForm;
