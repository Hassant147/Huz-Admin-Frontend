import React from "react";
import HotelForm from "./HotelForm";
import { enrollPackageHotelDetail, editPackageHotelDetail } from "../../../../utility/Api";
import hotelDataJson from "../../../../Makkah_Hotels.json";
import { PACKAGE_FLOW_STORAGE_KEYS } from "../packageFlow/packageFlowState";

const amenitiesList = [
    'Shuttle service',
    'Air Conditioning',
    'Television',
    'WiFi',
    'Elevator',
    'Attached Bathroom',
    'Washroom Amenities',
    'English Toilet',
    'Indian Toilet',
    'Laundry'
];

const convertAmenitiesToBoolean = (amenities) => {
    const amenitiesBoolean = {};
    amenitiesList.forEach(amenity => {
        amenitiesBoolean[amenity] = amenities.includes(amenity);
    });
    return amenitiesBoolean;
};

const parseDistance = (distance) => {
    const [value, unit] = distance.split(' ');
    return { value: parseFloat(value), unit };
};

const MakkahHotelForm = ({ formData, onChange, onNextTab, isEditing }) => {
  const submitMakkahHotelData = async (hotelData) => {
    const { partner_session_token } = JSON.parse(
      localStorage.getItem("SignedUp-User-Profile")
    );
    const amenitiesBoolean = convertAmenitiesToBoolean(hotelData.amenities);
    const { value: hotelDistance, unit: distanceType } = parseDistance(
      hotelData.hotel_distance
    );
    const payload = {
      partner_session_token,
      huz_token: localStorage.getItem(PACKAGE_FLOW_STORAGE_KEYS.huzToken),
      hotel_city: "Mecca",
      hotel_name: hotelData.hotelName,
      hotel_rating: hotelData.hotel_rating,
      room_sharing_type: hotelData.roomSharingType,
      hotel_distance: hotelDistance,
      distance_type: distanceType,
      is_shuttle_services_included: amenitiesBoolean["Shuttle service"],
      is_air_condition: amenitiesBoolean["Air Conditioning"],
      is_television: amenitiesBoolean["Television"],
      is_wifi: amenitiesBoolean["WiFi"],
      is_elevator: amenitiesBoolean["Elevator"],
      is_attach_bathroom: amenitiesBoolean["Attached Bathroom"],
      is_washroom_amenities: amenitiesBoolean["Washroom Amenities"],
      is_english_toilet: amenitiesBoolean["English Toilet"],
      is_indian_toilet: amenitiesBoolean["Indian Toilet"],
      is_laundry: amenitiesBoolean["Laundry"],
    };

    try {
      let response;

      if (isEditing) {
        const hotelId = localStorage.getItem(PACKAGE_FLOW_STORAGE_KEYS.meccaHotelId);
        if (!hotelId) {
          throw new Error("Makkah hotel ID is missing.");
        }

        response = await editPackageHotelDetail({ ...payload, hotel_id: hotelId });
      } else {
        response = await enrollPackageHotelDetail(payload);
        const meccaHotel = response?.hotel_detail?.find(
          (hotel) => hotel.hotel_city === "Mecca"
        );
        if (meccaHotel?.hotel_id) {
          localStorage.setItem(PACKAGE_FLOW_STORAGE_KEYS.meccaHotelId, meccaHotel.hotel_id);
        }
      }

      if (response && typeof response === "object") {
        localStorage.setItem(
          PACKAGE_FLOW_STORAGE_KEYS.packageDetail,
          JSON.stringify(response)
        );
      }

      return { success: true, message: response?.message || "Data submitted successfully!" };
    } catch (error) {
      return { success: false, message: error.message || "Failed to submit data." };
    }
  };

  return (
    <HotelForm
      formData={formData}
      hotels={hotelDataJson}
      onChange={onChange}
      submitHotelData={submitMakkahHotelData}
      editHotelData={submitMakkahHotelData}
      onNextTab={onNextTab}
      title="Hotel in Makkah"
      localStorageKey={PACKAGE_FLOW_STORAGE_KEYS.makkahHotelDetails}
      isEditing={isEditing}
    />
  );
};

export default MakkahHotelForm;
