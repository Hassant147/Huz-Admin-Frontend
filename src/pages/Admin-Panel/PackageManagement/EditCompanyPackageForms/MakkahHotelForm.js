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

// Function to split distance into value and type
const splitDistance = (distanceStr) => {
    const [distance, type] = distanceStr.split(' ');
    return { distance: parseFloat(distance), type: type.trim() };
};

const MakkahHotelForm = ({ formData, onChange, onNextTab, isEditing }) => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        // Fetch data from JSON file
        setHotels(hotelDataJson); // Assuming hotelDataJson is an array of hotels
    }, [isEditing, formData]);

    const postMakkahHotelData = async (hotelData) => {
        const huzToken = isEditing ? formData.huz_token : localStorage.getItem('huz_token');
        const { partner_session_token } = JSON.parse(localStorage.getItem('SignedUp-User-Profile'));
        const amenitiesBoolean = convertAmenitiesToBoolean(hotelData.amenities);

        // Split the hotel distance into value and type
        const { distance, type } = splitDistance(hotelData.hotelDistance);

        const apiData = {
            partner_session_token,
            huz_token: huzToken,
            hotel_city: "Mecca",
            hotel_name: hotelData.hotelName,
            hotel_rating: hotelData.hotelRating,
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
            let response;
            if (isEditing) {
                const makkahHotel = formData.hotel_detail.find(hotel => hotel.hotel_city.toLowerCase() === 'mecca');

                if (makkahHotel) {
                    apiData.hotel_id = makkahHotel.hotel_id; // Add hotel ID for editing
                    response = await editPackageHotelDetail(apiData, { headers: { 'Content-Type': 'application/json' } }); // Call the edit API
                    localStorage.setItem('packageDetail', JSON.stringify(response));
                } else {
                    throw new Error('Makkah hotel not found in form data');
                }
            } else {
                response = await enrollPackageHotelDetail(apiData, { headers: { 'Content-Type': 'application/json' } }); // Call the create API
            }

            return { success: true, message: response.message || "Data submitted successfully!" };

        } catch (error) {
            return { success: false, message: error.message || "Failed to submit data." };
        }
    };

    const makkahHotelData = isEditing ? formData.hotel_detail.find(hotel => hotel.hotel_city.toLowerCase() === 'mecca') : {};
    return (
        <div>
            <HotelForm
                huzToken={formData.huz_token}
                formData={makkahHotelData}
                hotels={hotels} // Pass all hotels to HotelForm
                onChange={onChange}
                submitHotelData={postMakkahHotelData}
                onNextTab={onNextTab}
                title="Hotel in Makkah"
                localStorageKey="MakkahHotelDetails"
                isEditing={isEditing}
                city="Mecca"
            />
        </div>
    );
};

export default MakkahHotelForm;
