import React, { useState, useEffect } from 'react';
import HotelForm from './HotelForm';
import { enrollPackageHotelDetail, editPackageHotelDetail } from '../../../../utility/Api';
import { useNavigate } from 'react-router-dom';
import hotelDataJson from '../../../../Madina_Hotels.json'; // Ensure correct import path

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

const MadinahHotelForm = ({ formData, onChange, onNextTab, isEditing }) => {
    const [hotels, setHotels] = useState([]);
    const huzToken = localStorage.getItem('huz_token');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data from JSON file
        setHotels(hotelDataJson); // Assuming hotelDataJson is an array of hotels
    }, []);

    const postMadinahHotelData = async (hotelData) => {
        const { partner_session_token } = JSON.parse(localStorage.getItem('SignedUp-User-Profile'));
        const amenitiesBoolean = convertAmenitiesToBoolean(hotelData.amenities);
        const { value: hotelDistance, unit: distanceType } = parseDistance(hotelData.hotel_distance);

        const payload = {
            partner_session_token,
            huz_token: huzToken,
            hotel_city: "Madinah",
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
            if (response && response.hotel_detail) {
                const madinahHotel = response.hotel_detail.find(hotel => hotel.hotel_city === "Madinah");

                if (madinahHotel && madinahHotel.hotel_id) {
                    localStorage.setItem('Madinah_hotel_id', madinahHotel.hotel_id);
                    navigate(`/packagedetails?partnerSessionToken=${encodeURIComponent(partner_session_token)}&huzToken=${encodeURIComponent(huzToken)}`);
                    return { success: true, message: response.message || "Data submitted successfully!" };
                } else {
                    throw new Error('Madinah hotel ID is missing in the response');
                }
            } else {
                throw new Error('Hotel details are missing in the response');
            }
        } catch (error) {
            return { success: false, message: error.message || "Failed to submit data." };
        }
    };

    // const editMadinahHotelData = async (hotelData) => {
    //     const { partner_session_token } = JSON.parse(localStorage.getItem('SignedUp-User-Profile'));
    //     const hotelId = localStorage.getItem('Madinah_hotel_id');
    //     const amenitiesBoolean = convertAmenitiesToBoolean(hotelData.amenities);
    //     const { value: hotelDistance, unit: distanceType } = parseDistance(hotelData.hotel_distance);

    //     const payload = {
    //         hotel_id: hotelId,
    //         partner_session_token,
    //         huz_token: huzToken,
    //         hotel_city: "Madinah",
    //         hotel_name: hotelData.hotelName,
    //         hotel_rating: hotelData.hotelRating,
    //         room_sharing_type: hotelData.roomSharingType,
    //         hotel_distance: hotelDistance,
    //         distance_type: distanceType,
    //         is_shuttle_services_included: amenitiesBoolean['Shuttle service'],
    //         is_air_condition: amenitiesBoolean['Air Conditioning'],
    //         is_Television: amenitiesBoolean['Television'],
    //         is_wifi: amenitiesBoolean['WiFi'],
    //         is_elevator: amenitiesBoolean['Elevator'],
    //         is_attach_bathroom: amenitiesBoolean['Attached Bathroom'],
    //         is_washroom_amenities: amenitiesBoolean['Washroom Amenities'],
    //         is_english_toilet: amenitiesBoolean['English Toilet'],
    //         is_indian_toilet: amenitiesBoolean['Indian Toilet'],
    //         is_laundry: amenitiesBoolean['Laundry']
    //     };

    //     try {
    //         const response = await editPackageHotelDetail(payload, { headers: { 'Content-Type': 'application/json' } });
    //         if (response && response.hotel_detail) {
    //             navigate(`/packagedetails?partnerSessionToken=${encodeURIComponent(partner_session_token)}&huzToken=${encodeURIComponent(huzToken)}`);
    //             return { success: true, message: response.message || "Data submitted successfully!" };
    //         } else {
    //             throw new Error('Hotel details are missing in the response');
    //         }
    //     } catch (error) {
    //         return { success: false, message: error.message || "Failed to submit data." };
    //     }
    // };

    const handleSubmit = async (hotelData) => {
        const hotelId = localStorage.getItem('Madinah_hotel_id');
        // if (hotelId) {
        //     return await editMadinahHotelData(hotelData);
        // } else {
        return await postMadinahHotelData(hotelData);
        // }
    };

    return (
        <div>
            <HotelForm
                formData={formData}
                hotels={hotels} // Pass all hotels to HotelForm
                onChange={onChange}
                submitHotelData={handleSubmit}
                // editHotelData={editMadinahHotelData}
                onNextTab={onNextTab}
                title="Hotel in Madinah"
                localStorageKey="MadinahHotelDetails"
            // isEditing={isEditing}
            />
        </div>
    );
};

export default MadinahHotelForm;
