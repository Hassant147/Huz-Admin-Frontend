import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import ClipLoader from "../../../../components/loader";
import { BiErrorAlt, BiSearch } from "react-icons/bi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const HotelForm = ({
  formData,
  onChange,
  submitHotelData,
  editHotelData,
  onNextTab,
  title,
  localStorageKey,
  isEditing,
  hotels,
}) => {
  const [hotelDetails, setHotelDetails] = useState({
    hotelName: "",
    roomSharingType: "",
    amenities: [],
  });

  const [filteredHotels, setFilteredHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showHotelList, setShowHotelList] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const hotelNameInputRef = useRef(null);

  const initialStateSet = useRef(false);

  useEffect(() => {
    if (!initialStateSet.current) {
      const savedData = localStorage.getItem(localStorageKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setHotelDetails({
          ...parsedData,
          amenities: Array.isArray(parsedData.amenities)
            ? parsedData.amenities
            : [],
        });
        autoSelectHotel(parsedData.hotelName);
      }
      initialStateSet.current = true;
    }
  }, [localStorageKey]);

  useEffect(() => {
    if (formData && !initialStateSet.current) {
      setHotelDetails({
        hotelName: formData.hotelName || "",
        roomSharingType: formData.roomSharingType || "",
        amenities: Array.isArray(formData.amenities) ? formData.amenities : [],
      });
      autoSelectHotel(formData.hotelName);
      initialStateSet.current = true;
    }
  }, [formData]);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(hotelDetails));
  }, [hotelDetails, localStorageKey]);

  const [errors, setErrors] = useState({
    hotelName: "",
    roomSharingType: "",
    amenities: "",
    files: "",
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const validateField = (field) => {
    const value = hotelDetails[field];
    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [field]: capitalizeFirstLetter(
          `${field.replace(/([A-Z])/g, " $1").trim()} is required`
        ),
      }));
      return false;
    }
    return true;
  };

  const handleFieldChange = (field, value) => {
    const updatedDetails = { ...hotelDetails, [field]: value };
    setHotelDetails(updatedDetails);
    setErrors((prev) => ({ ...prev, [field]: "" }));
    onChange(updatedDetails);
  };

  const handleAmenityChange = (amenity) => {
    const updatedAmenities = hotelDetails.amenities.includes(amenity)
      ? hotelDetails.amenities.filter((a) => a !== amenity)
      : [...hotelDetails.amenities, amenity];

    setHotelDetails((prev) => ({ ...prev, amenities: updatedAmenities }));
    setErrors((prev) => ({
      ...prev,
      amenities: updatedAmenities.length
        ? ""
        : "At least one amenity must be selected",
    }));
  };

  const handleHotelNameChange = (value) => {
    handleFieldChange("hotelName", value);
    setSelectedHotel(null);
    if (value) {
      const filtered = hotels.filter((hotel) =>
        hotel.hotel_Name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredHotels(filtered);
      setShowHotelList(true);
    } else {
      setShowHotelList(false);
    }
  };

  const handleHotelSelect = (hotel) => {
    const updatedDetails = {
      ...hotelDetails,
      hotelName: hotel.hotel_Name,
      hotel_rating: hotel.category,
      hotel_distance:
        title === "Hotel in Makkah"
          ? hotel.distance_from_kaaba
          : hotel.distance_from_Madinah,
    };

    setHotelDetails(updatedDetails);
    setSelectedHotel(hotel);
    setImagesLoaded(false);
    setShowHotelList(false);
  };

  const handleContinue = async () => {
    let isValid = true;
    ["hotelName", "roomSharingType"].forEach((field) => {
      isValid = validateField(field) && isValid;
    });

    if (hotelDetails.amenities.length === 0) {
      isValid = false;
      setErrors((prev) => ({
        ...prev,
        amenities: "At least one amenity must be selected",
      }));
    }

    if (isValid) {
      setLoading(true);
      setApiError("");
      const response = isEditing
        ? await editHotelData(hotelDetails)
        : await submitHotelData(hotelDetails);
      setLoading(false);
      if (response.success) {
        onNextTab();
      } else {
        setApiError(response.message || "Submission failed");
      }
    }
  };

  const roomSharingTypeOptions = [
    { value: "", label: "Select Room Sharing Type" },
    { value: "Single", label: "Single" },
    { value: "Double", label: "Double" },
    { value: "Triple", label: "Triple" },
    { value: "Quad", label: "Quad" },
  ];

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  const autoSelectHotel = (hotelName) => {
    if (hotelName) {
      const selectedHotel = hotels.find(
        (hotel) => hotel.hotel_Name === hotelName
      );
      if (selectedHotel) {
        handleHotelSelect(selectedHotel);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 font-sans text-xs lg:text-sm">
      <div className="space-y-6 lg:w-3/4 relative">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h1 className="text-sm lg:text-base text-gray-600 mb-5">{title}</h1>
          <div className="relative">
            <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
              Hotel Name
            </label>
            <div className="relative">
              <BiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={hotelDetails.hotelName}
                onChange={(e) => handleHotelNameChange(e.target.value)}
                onBlur={() => {
                  validateField("hotelName");
                  setShowHotelList(false);
                }}
                onFocus={() => {
                  if (hotelDetails.hotelName) {
                    setShowHotelList(true);
                  }
                }}
                ref={hotelNameInputRef}
                className={`p-2 pl-8 lg:w-1/2 outline-none border rounded-md w-full font-thin text-xs lg:text-sm shadow-sm ${
                  errors.hotelName ? "border-red-500" : ""
                }`}
                placeholder="Search hotel name"
              />
            </div>

            {errors.hotelName && (
              <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <BiErrorAlt />
                <p className="text-red-500 text-xs">{errors.hotelName}</p>
              </div>
            )}
            {showHotelList && (
              <ul className="absolute bg-white border border-gray-200 w-full mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {filteredHotels.map((hotel) => (
                  <li
                    key={hotel.hotel_id}
                    onMouseDown={() => handleHotelSelect(hotel)}
                    className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                  >
                    {hotel.hotel_Name}
                  </li>
                ))}
              </ul>
            )}
            {selectedHotel && hotelDetails.hotelName && (
              <div className="mt-4 w-full p-4 border border-gray-300 rounded-lg shadow-sm flex flex-col md:flex-row">
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold">
                    {selectedHotel.hotel_Name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedHotel.description}
                  </p>
                  <div className="flex flex-wrap space-x-4 mt-2">
                    <p className="text-sm text-gray-600">
                      {selectedHotel.category}
                    </p>
                    <p className="text-sm text-gray-600">
                      Rating {selectedHotel.rating}
                    </p>
                  </div>
                  <div className="flex flex-wrap lg:space-x-4 mt-1">
                    <p className="text-sm text-gray-600">
                      {selectedHotel.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      {title === "Hotel in Makkah"
                        ? `Distance from Kaaba ${selectedHotel.distance_from_kaaba}`
                        : `Distance from Masjid Nabwi ${selectedHotel.distance_from_Madinah}`}
                    </p>
                  </div>
                </div>
                <div className="relative w-full md:w-32 md:h-32 mt-4 md:mt-0">
                  {!imagesLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ClipLoader size={32} color={"#00936C"} />
                    </div>
                  )}
                  <Swiper spaceBetween={10} slidesPerView={1}>
                    {[
                      selectedHotel.image1,
                      selectedHotel.image2,
                      selectedHotel.image3,
                      selectedHotel.image4,
                    ].map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={`${selectedHotel.hotel_Name} - ${index + 1}`}
                          className="w-full h-full rounded-lg object-cover"
                          style={{ height: "128px", width: "128px" }}
                          onLoad={handleImageLoad}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            )}
          </div>
          {selectedHotel && hotelDetails.hotelName && (
            <div className="mt-4 space-y-4">
              <div className="lg:w-1/2">
                <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
                  Room Sharing Type
                </label>
                <Select
                  value={roomSharingTypeOptions.find(
                    (option) => option.value === hotelDetails.roomSharingType
                  )}
                  onChange={(option) =>
                    handleFieldChange("roomSharingType", option?.value)
                  }
                  options={roomSharingTypeOptions}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      fontSize: "0.75rem",
                      borderColor: state.isFocused
                        ? "#718096"
                        : errors.roomSharingType
                        ? "#e53e3e"
                        : "#cbd5e0",
                      boxShadow: state.isFocused
                        ? "0 0 0 1px #718096"
                        : provided.boxShadow,
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected
                        ? "#00936C"
                        : state.isFocused
                        ? "#edf2f7"
                        : "inherit",
                    }),
                  }}
                  className={`react-select-container ${
                    errors.roomSharingType
                      ? "border-red-500"
                      : "border-gray-400"
                  }`}
                  classNamePrefix="react-select"
                />
                {errors.roomSharingType && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <BiErrorAlt />
                    <p className="text-red-500 text-xs">
                      {errors.roomSharingType}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs lg:text-sm font-light text-gray-600 mb-2">
                  Amenities
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                  {[
                    "Shuttle service",
                    "Air Conditioning",
                    "Television",
                    "WiFi",
                    "Elevator",
                    "Attached Bathroom",
                    "Washroom Amenities",
                    "English Toilet",
                    "Indian Toilet",
                    "Laundry",
                  ].map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center mb-2 text-[9px] md:text-xs lg:text-[9px] xl:text-xs font-thin text-gray-500"
                    >
                      <input
                        type="checkbox"
                        id={amenity}
                        checked={hotelDetails.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="mr-2"
                        style={{ accentColor: "#00936C" }}
                      />
                      <label htmlFor={amenity}>{amenity}</label>
                    </div>
                  ))}
                </div>
                {errors.amenities && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <BiErrorAlt />
                    <p className="text-red-500 text-xs">{errors.amenities}</p>
                  </div>
                )}
              </div>
            </div>
          )}
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
        <p className="text-xs text-gray-600">
          Please ensure that the information you provide is accurate and
          carefully considered. HUZ Solutions will verify the data submitted
          during registration prior to listing your company on the platform.
        </p>
      </div>
    </div>
  );
};

export default HotelForm;
