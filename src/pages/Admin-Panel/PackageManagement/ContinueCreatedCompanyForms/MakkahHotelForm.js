import React, { useState, useEffect } from 'react';
import HotelForm from './HotelForm';
import { enrollPackageHotelDetail } from '../../../../utility/Api'; // Import the API functions
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

// Function to split distance into value and type
const splitDistance = (distanceStr) => {
    const [distance, type] = distanceStr.split(' ');
    return { distance: parseFloat(distance), type: type.trim() };
};

const MakkahHotelForm = ({ formData, onChange, onNextTab }) => {
    const [hotels, setHotels] = useState([]);
    const huzToken = localStorage.getItem('huz_token');

    useEffect(() => {
        // Fetch data from JSON file
        setHotels(hotelDataJson); // Assuming hotelDataJson is an array of hotels
    }, []);

    const postMakkahHotelData = async (hotelData) => {
        const { partner_session_token } = JSON.parse(localStorage.getItem('SignedUp-User-Profile'));
        const amenitiesBoolean = convertAmenitiesToBoolean(hotelData.amenities);
        // Split the hotel distance into value and type
        const { distance, type } = splitDistance(hotelData.hotel_distance);

        const payload = {
            partner_session_token,
            huz_token: huzToken,
            hotel_city: "Mecca",
            hotel_name: hotelData.hotelName,
            hotel_rating: hotelData.hotel_rating,
            room_sharing_type: hotelData.roomSharingType,
            hotel_distance: distance,
            distance_type: type,
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
            if (response && response.hotel_detail && response.hotel_detail[0] && response.hotel_detail[0].hotel_id) {
                return { success: true, message: response.message || "Data submitted successfully!" };
            } else {
                throw new Error('Hotel ID is missing in the response');
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
                onNextTab={onNextTab}
                title="Hotel in Makkah"
                localStorageKey="MakkahHotelDetails"
            />
        </div>
    );
};

export default MakkahHotelForm;
