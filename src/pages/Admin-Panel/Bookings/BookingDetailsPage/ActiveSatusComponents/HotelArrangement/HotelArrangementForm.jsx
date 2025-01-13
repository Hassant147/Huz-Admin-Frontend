import React, { useState, useEffect, useContext } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { postTransportDetails, updateTransportDetails } from '../../../../../../utility/Api';
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

const HotelArrangementForm = ({ isEditing, booking }) => {
    const [formData, setFormData] = useState({
        jeddahContactName: "",
        jeddahContact: "",
        makkahContact1Name: "",
        makkahContact1: "",
        makkahContact2Name: "",
        makkahContact2: "",
        makkahNote: "",
        madinahNote: "",
        hotelOrTransportId: null,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isEditing && booking) {
            const hotelDetails = booking.booking_hotel_and_transport_details.find(
                (detail) => detail.detail_for === "Hotel"
            );

            if (hotelDetails) {
                setFormData({
                    hotelOrTransportId: hotelDetails.hotel_or_transport_id,
                    jeddahContactName: hotelDetails.jeddah_name || "",
                    jeddahContact: hotelDetails.jeddah_number || "",
                    makkahContact1Name: hotelDetails.mecca_name || "",
                    makkahContact1: hotelDetails.mecca_number || "",
                    makkahContact2Name: hotelDetails.madinah_name || "",
                    makkahContact2: hotelDetails.madinah_number || "",
                    makkahNote: hotelDetails.comment_1 || "",
                    madinahNote: hotelDetails.comment_2 || "",
                });
            }
        }
    }, [isEditing, booking]);

    const validateField = (fieldName, value) => {
        let error = null;
        if (!value) {
            error = `${fieldName.replace(/([A-Z])/g, ' $1')} is required`;
        }
        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: error
        }));
    };

    const handleInputChange = (fieldName, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: value
        }));
        validateField(fieldName, value);
    };

    const handlePhoneNumberChange = (value, fieldName) => {
        if (value && value.replace(/[^0-9]/g, '').length > 13) {
            return; // Prevent further input if more than 13 digits
        }
        handleInputChange(fieldName, value);
    };

    const validateAllFields = () => {
        const requiredFields = [
            'jeddahContactName', 'jeddahContact', 'makkahContact1Name', 'makkahContact1', 'makkahContact2Name', 'makkahContact2', 'makkahNote', 'madinahNote'
        ];

        const newErrors = {};
        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} is required`;
            }
        });

        setErrors(newErrors);

        // Return true if there are no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateAllFields()) {
            return;
        }

        setLoading(true);

        const apiData = {
            partner_session_token: booking.partner_session_token,
            booking_number: booking.booking_number,
            detail_for: "Hotel",
            jeddah_name: formData.jeddahContactName,
            jeddah_number: formData.jeddahContact,
            mecca_name: formData.makkahContact1Name,
            mecca_number: formData.makkahContact1,
            madinah_name: formData.makkahContact2Name,
            madinah_number: formData.makkahContact2,
            comment_1: formData.makkahNote,
            comment_2: formData.madinahNote,
        };

        try {
            if (isEditing) {
                apiData.hotel_or_transport_id = formData.hotelOrTransportId; // Add the ID for editing
                await updateTransportDetails(apiData);
                toast.success("Hotel arrangement updated successfully!");
            } else {
                await postTransportDetails(apiData);
                toast.success("Hotel arrangement submitted successfully!");
            }

            navigate(-1);
        } catch (error) {
            console.error("Failed to submit form:", error);
            toast.error("Failed to submit form. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Toaster position="top-right" />
            <form onSubmit={handleSubmit} className=" w-full mx-auto">
                <div className="p-6 rounded bg-white border-[1px]">
                    <h1 className="text-gray-600 text-normal text-lg mb-4">
                        Update hotel arrangement for customer
                    </h1>
                    <span className="text-sm text-gray-500 text-light">What are your transporter's contact details for Makkah?</span>
                    <div className="space-y-4 mt-8">
                        {/* Jeddah Contact Inputs */}
                        <div className="lg:flex items-center gap-5">
                            <div className="w-full lg:w-1/2">
                                <h1 className="text-sm text-gray-500 text-light mb-1">
                                    Contact Name (Jeddah)
                                </h1>
                                <input
                                    type="text"
                                    value={formData.jeddahContactName}
                                    onChange={(e) => handleInputChange('jeddahContactName', e.target.value)}
                                    onBlur={(e) => validateField('jeddahContactName', e.target.value)}
                                    className="px-4 md:py-1.5 block rounded border-[2px] border-[#DEDDDD] w-full text-sm text-gray-600"
                                />
                                {errors.jeddahContactName && <p className="text-red-500 text-xs">{errors.jeddahContactName}</p>}
                            </div>
                            <div className="w-full lg:w-1/2">
                                <h1 className="text-sm text-gray-500 text-light mb-1">
                                    Contact Number (Jeddah)
                                </h1>
                                <PhoneInput
                                    country={'pk'}
                                    value={formData.jeddahContact}
                                    onChange={(value) => handlePhoneNumberChange(value, 'jeddahContact')}
                                    containerClass="form-input-container"
                                    inputClass="form-input rounded w-full text-sm text-gray-600"
                                />
                                {errors.jeddahContact && <p className="text-red-500 text-xs">{errors.jeddahContact}</p>}
                            </div>
                        </div>
                        {/* Makkah Contact 1 Inputs */}
                        <div className="lg:flex items-center gap-5">
                            <div className="w-full lg:w-1/2">
                                <h1 className="text-sm text-gray-500 text-light mb-1">
                                    Contact Name (Makkah)
                                </h1>
                                <input
                                    type="text"
                                    value={formData.makkahContact1Name}
                                    onChange={(e) => handleInputChange('makkahContact1Name', e.target.value)}
                                    onBlur={(e) => validateField('makkahContact1Name', e.target.value)}
                                    className="px-4 md:py-1.5 block rounded border-[2px] border-[#DEDDDD] w-full text-sm text-gray-600"
                                />
                                {errors.makkahContact1Name && <p className="text-red-500 text-xs">{errors.makkahContact1Name}</p>}
                            </div>
                            <div className="w-full lg:w-1/2">
                                <h1 className="text-sm text-gray-500 text-light mb-1">
                                    Contact Number (Makkah)
                                </h1>
                                <PhoneInput
                                    country={'pk'}
                                    value={formData.makkahContact1}
                                    onChange={(value) => handlePhoneNumberChange(value, 'makkahContact1')}
                                    containerClass="form-input-container"
                                    inputClass="form-input rounded w-full text-sm text-gray-600"
                                />
                                {errors.makkahContact1 && <p className="text-red-500 text-xs">{errors.makkahContact1}</p>}
                            </div>
                        </div>
                        {/* Makkah Contact 2 Inputs */}
                        <div className="lg:flex items-center gap-5">
                            <div className="w-full lg:w-1/2">
                                <h1 className="text-sm text-gray-500 text-light mb-1">
                                    Contact Name (Madinah)
                                </h1>
                                <input
                                    type="text"
                                    value={formData.makkahContact2Name}
                                    onChange={(e) => handleInputChange('makkahContact2Name', e.target.value)}
                                    onBlur={(e) => validateField('makkahContact2Name', e.target.value)}
                                    className="px-4 md:py-1.5 block rounded border-[2px] border-[#DEDDDD] w-full text-sm text-gray-600"
                                />
                                {errors.makkahContact2Name && <p className="text-red-500 text-xs">{errors.makkahContact2Name}</p>}
                            </div>
                            <div className="w-full lg:w-1/2">
                                <h1 className="text-sm text-gray-500 text-light mb-1">
                                    Contact Number (Madinah)
                                </h1>
                                <PhoneInput
                                    country={'pk'}
                                    value={formData.makkahContact2}
                                    onChange={(value) => handlePhoneNumberChange(value, 'makkahContact2')}
                                    containerClass="form-input-container"
                                    inputClass="form-input rounded w-full text-sm text-gray-600"
                                />
                                {errors.makkahContact2 && <p className="text-red-500 text-xs">{errors.makkahContact2}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Text Area for Notes */}
                <div className="mt-4 bg-white border-[1px] p-6 rounded">
                    <div className="mb-4">
                        <label htmlFor="makkahNote" className="text-sm text-gray-500 text-light">
                            Makkah Hotel Arrangement Note
                        </label>
                        <textarea
                            id="makkahNote"
                            className="w-full text-sm text-gray-600 mt-2 h-52 p-4 border border-gray-300 rounded-md resize-none"
                            placeholder="Details about Makkah hotel arrangement"
                            value={formData.makkahNote}
                            onChange={(e) => handleInputChange('makkahNote', e.target.value)}
                            onBlur={(e) => validateField('makkahNote', e.target.value)}
                        />
                        {errors.makkahNote && <p className="text-red-500 text-xs">{errors.makkahNote}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="madinahNote" className="text-sm text-gray-500 text-light">
                            Madinah Hotel Arrangement Note
                        </label>
                        <textarea
                            id="madinahNote"
                            className="text-sm text-gray-600 w-full mt-2 h-52 p-4 border border-gray-300 rounded-md resize-none"
                            placeholder="Details about Madinah hotel arrangement"
                            value={formData.madinahNote}
                            onChange={(e) => handleInputChange('madinahNote', e.target.value)}
                            onBlur={(e) => validateField('madinahNote', e.target.value)}
                        />
                        {errors.madinahNote && <p className="text-red-500 text-xs">{errors.madinahNote}</p>}
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 justify-center py-2 px-4 h-[50px] border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-[#00936ce0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full flex items-center"
                >
                    {loading ? <ClipLoader color="white" size={20} /> : "Share with Customer"}
                </button>
            </form>
        </div>
    );
};

export default HotelArrangementForm;
