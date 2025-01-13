import React, { useState, useEffect } from 'react';
import HotelForm from './HotelForm';
import { enrollPackageHotelDetail, editPackageHotelDetail } from '../../../../utility/Api';
import hotelDataJson from '../../../../Makkah_Hotels.json'; // Ensure correct import path

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
    const [hotels, setHotels] = useState([]);
    const huzToken = localStorage.getItem('huz_token');

    useEffect(() => {
        // Fetch data from JSON file
        setHotels(hotelDataJson); // Assuming hotelDataJson is an array of hotels
    }, []);

    const postMakkahHotelData = async (hotelData) => {
        const { partner_session_token } = JSON.parse(localStorage.getItem('SignedUp-User-Profile'));
        const amenitiesBoolean = convertAmenitiesToBoolean(hotelData.amenities);
        const { value: hotelDistance, unit: distanceType } = parseDistance(hotelData.hotel_distance);

        const payload = {
            partner_session_token,
            huz_token: huzToken,
            hotel_city: "Mecca",
            hotel_name: hotelData.hotelName,
            hotel_rating: hotelData.hotel_rating,
            room_sharing_type: hotelData.roomSharingType,
            hotel_distance: hotelDistance,
            distance_type: distanceType,
            is_shuttle_services_included: amenitiesBoolean['Shuttle service'],
            is_air_condition: amenitiesBoolean['Air Conditioning'],
            is_television: amenitiesBoolean['Television'],
            is_wifi: amenitiesBoolean['WiFi'],
            is_elevator: amenitiesBoolean['Elevator'],
            is_attach_bathroom: amenitiesBoolean['Attached Bathroom'],
            is_washroom_amenities: amenitiesBoolean['Washroom Amenities'],
            is_english_toilet: amenitiesBoolean['English Toilet'],
            is_indian_toilet: amenitiesBoolean['Indian Toilet'],
            is_laundry: amenitiesBoolean['Laundry']
        };

        try {
            const response = await enrollPackageHotelDetail(payload, { headers: { 'Content-Type': 'application/json' } });
            const meccaHotel = response.hotel_detail.find(hotel => hotel.hotel_city === "Mecca");
            const hotelId = meccaHotel.hotel_id;
            localStorage.setItem('Mecca_hotel_id', hotelId);

            if (response && response.hotel_detail) {
                return { success: true, message: response.message || "Data submitted successfully!" };
            } else {
                throw new Error('Hotel details are missing in the response');
            }
        } catch (error) {
            return { success: false, message: error.message || "Failed to submit data." };
        }
    };

    const editMakkahHotelData = async (hotelData) => {
        const { partner_session_token } = JSON.parse(localStorage.getItem('SignedUp-User-Profile'));
        const hotelId = localStorage.getItem('Mecca_hotel_id');
        const amenitiesBoolean = convertAmenitiesToBoolean(hotelData.amenities);
        const { value: hotelDistance, unit: distanceType } = parseDistance(hotelData.hotel_distance);

        const payload = {
            hotel_id: hotelId,
            partner_session_token,
            huz_token: huzToken,
            hotel_city: "Mecca",
            hotel_name: hotelData.hotelName,
            hotel_rating: hotelData.hotel_rating,
            room_sharing_type: hotelData.roomSharingType,
            hotel_distance: hotelDistance,
            distance_type: distanceType,
            is_shuttle_services_included: amenitiesBoolean['Shuttle service'],
            is_air_condition: amenitiesBoolean['Air Conditioning'],
            is_Television: amenitiesBoolean['Television'],
            is_wifi: amenitiesBoolean['WiFi'],
            is_elevator: amenitiesBoolean['Elevator'],
            is_attach_bathroom: amenitiesBoolean['Attached Bathroom'],
            is_washroom_amenities: amenitiesBoolean['Washroom Amenities'],
            is_english_toilet: amenitiesBoolean['English Toilet'],
            is_indian_toilet: amenitiesBoolean['Indian Toilet'],
            is_laundry: amenitiesBoolean['Laundry']
        };

        try {
            const response = await editPackageHotelDetail(payload, { headers: { 'Content-Type': 'application/json' } });
            if (response && response.hotel_detail) {
                return { success: true, message: response.message || "Data submitted successfully!" };
            } else {
                throw new Error('Hotel details are missing in the response');
            }
        } catch (error) {
            return { success: false, message: error.message || "Failed to submit data." };
        }
    };

    return (
        <div>
            <HotelForm
                formData={formData}
                hotels={hotels} // Pass all hotels to HotelForm
                onChange={onChange}
                submitHotelData={postMakkahHotelData}
                editHotelData={editMakkahHotelData}
                onNextTab={onNextTab}
                title="Hotel in Makkah"
                localStorageKey="MakkahHotelDetails"
                isEditing={isEditing}
            />
        </div>
    );
};

export default MakkahHotelForm;
