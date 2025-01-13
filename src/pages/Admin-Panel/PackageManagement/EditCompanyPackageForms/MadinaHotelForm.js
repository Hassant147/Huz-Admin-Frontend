import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelForm from './HotelForm';
import { enrollPackageHotelDetail, editPackageHotelDetail } from '../../../../utility/Api';
import hotelDataJson from '../../../../Madina_Hotels.json'; // Ensure correct import path

// Function to split distance into value and type
const splitDistance = (distanceStr) => {
    const [distance, type] = distanceStr.split(' ');
    return { distance: parseFloat(distance), type: type.trim() };
};

const MadinahHotelForm = ({ formData, onChange, onNextTab, isEditing }) => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        // Fetch data from JSON file
        setHotels(hotelDataJson); // Assuming hotelDataJson is an array of hotels
    }, [isEditing, formData]);


    const postMadinahHotelData = async (hotelData) => {
        const huzToken = isEditing ? formData.huz_token : localStorage.getItem('huz_token');
        const { partner_session_token } = JSON.parse(localStorage.getItem('SignedUp-User-Profile'));
        // Split the hotel distance into value and type
        const { distance, type } = splitDistance(hotelData.hotelDistance);
        const apiData = {
            partner_session_token,
            huz_token: huzToken,
            hotel_city: "madinah",
            hotel_name: hotelData.hotelName,
            hotel_rating: hotelData.hotelRating,
            room_sharing_type: hotelData.roomSharingType,
            hotel_distance: distance,
            distance_type: type,
            is_shuttle_services_included: hotelData.amenities.includes('Shuttle service'),
            is_air_condition: hotelData.amenities.includes('Air Conditioning'),
            is_television: hotelData.amenities.includes('Television'),
            is_wifi: hotelData.amenities.includes('WiFi'),
            is_elevator: hotelData.amenities.includes('Elevator'),
            is_attach_bathroom: hotelData.amenities.includes('Attached Bathroom'),
            is_washroom_amenities: hotelData.amenities.includes('Washroom Amenities'),
            is_english_toilet: hotelData.amenities.includes('English Toilet'),
            is_indian_toilet: hotelData.amenities.includes('Indian Toilet'),
            is_laundry: hotelData.amenities.includes('Laundry')
        };

        try {
            let response;
            if (isEditing) {
                const madinahHotel = formData.hotel_detail.find(hotel => hotel.hotel_city.toLowerCase() === 'madinah');
                if (madinahHotel) {
                    apiData.hotel_id = madinahHotel.hotel_id; // Add hotel ID for editing
                    response = await editPackageHotelDetail(apiData); // Call the edit API
                    localStorage.setItem('packageDetail', JSON.stringify(response));
                    navigate(`/packagedetails?partnerSessionToken=${encodeURIComponent(partner_session_token)}&huzToken=${encodeURIComponent(huzToken)}`);
                } else {
                    throw new Error('Madinah hotel not found in form data');
                }
            }

            return { success: true, message: response.message || "Data submitted successfully!" };

        } catch (error) {
            return { success: false, message: error.message || "Failed to submit data." };
        }
    };

    const madinahHotelData = isEditing ? formData.hotel_detail.find(hotel => hotel.hotel_city.toLowerCase() === 'madinah') : {};
    return (
        <div>
            <HotelForm
                huzToken={formData.huz_token}
                formData={madinahHotelData}
                hotels={hotels} // Pass all hotels to HotelForm
                onChange={onChange}
                submitHotelData={postMadinahHotelData}
                onNextTab={onNextTab}
                title="Hotel in Madinah"
                localStorageKey="MadinahHotelDetails"
                isEditing={isEditing}
                city="madinah"
            />
        </div>
    );
};

export default MadinahHotelForm;
