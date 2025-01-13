import React, { useState, useEffect, useContext } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./PhoneInput.css";
import { useNavigate } from "react-router-dom";
import { postTransportDetails, updateTransportDetails } from '../../../../../../utility/Api';
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

const TransportArrangementForm = ({ isEditing, booking }) => {
  const [formData, setFormData] = useState({
    jeddahContactName: "",
    jeddahContact: "",
    makkahContact1Name: "",
    makkahContact1: "",
    makkahContact2Name: "",
    makkahContact2: "",
    note: "",
    hotelOrTransportId: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing && booking) {
      const transportDetails = booking.booking_hotel_and_transport_details.find(
        (detail) => detail.detail_for === "Transport"
      );

      if (transportDetails) {
        setFormData({
          hotelOrTransportId: transportDetails.hotel_or_transport_id,
          jeddahContactName: transportDetails.jeddah_name || "",
          jeddahContact: transportDetails.jeddah_number || "",
          makkahContact1Name: transportDetails.mecca_name || "",
          makkahContact1: transportDetails.mecca_number || "",
          makkahContact2Name: transportDetails.madinah_name || "",
          makkahContact2: transportDetails.madinah_number || "",
          note: transportDetails.comment_1 || "",
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
      'jeddahContactName', 'jeddahContact', 'makkahContact1Name', 'makkahContact1', 'makkahContact2Name', 'makkahContact2', 'note'
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
      detail_for: "Transport",
      jeddah_name: formData.jeddahContactName,
      jeddah_number: formData.jeddahContact,
      mecca_name: formData.makkahContact1Name,
      mecca_number: formData.makkahContact1,
      madinah_name: formData.makkahContact2Name,
      madinah_number: formData.makkahContact2,
      comment_1: formData.note,
      comment_2: formData.note,
    };

    try {
      if (isEditing) {
        apiData.hotel_or_transport_id = formData.hotelOrTransportId; // Add the ID for editing
        await updateTransportDetails(apiData);
        toast.success("Transport arrangement updated successfully!");
      } else {
        await postTransportDetails(apiData);
        toast.success("Transport arrangement submitted successfully!");
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
      <form onSubmit={handleSubmit} className="">
        <div className="bg-white border-[1px] mx-auto rounded-md p-6">
          <h1 className="text-[#4B465C] font-semibold lg:text-[20px] md:text-[16px] text-[15px] opacity-80 pb-3">
            Update transport arrangement to customer
          </h1>
          <p className="font-medium text-[14px] text-[#4B465C] opacity-80 md:py-3 py-1.5">
            What are your transporter's contact details for Jeddah?
          </p>
          <div className="space-y-4">
            <div className="lg:flex items-center gap-5">
              <div className="lg:w-1/2  space-y-1">
                <label className="font-medium lg:text-[13px] md:text-[12px] text-[10px] text-[#4B465C] opacity-80 py-1.5">
                  Contact name (Jeddah)
                </label>
                <input
                  type="text"
                  value={formData.jeddahContactName}
                  onChange={(e) => handleInputChange('jeddahContactName', e.target.value)}
                  onBlur={(e) => validateField('jeddahContactName', e.target.value)}
                  className="px-4 md:py-1.5 block rounded border-[2px] border-[#DEDDDD] w-full text-sm text-gray-600"
                />
                {errors.jeddahContactName && <p className="text-red-500 text-xs">{errors.jeddahContactName}</p>}
              </div>
              <div className="md:w-1/2 space-y-1">
                <label className="font-medium lg:text-[13px] md:text-[12px] text-[10px] text-[#4B465C] opacity-80 py-1.5">
                  Contact Number (Jeddah)
                </label>
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
            <div className="lg:flex items-center gap-5">
              <div className="lg:w-1/2  space-y-1">
                <label className="font-medium lg:text-[13px] md:text-[12px] text-[10px] text-[#4B465C] opacity-80 py-1.5">
                  Contact name
                </label>
                <input
                  type="text"
                  value={formData.makkahContact1Name}
                  onChange={(e) => handleInputChange('makkahContact1Name', e.target.value)}
                  onBlur={(e) => validateField('makkahContact1Name', e.target.value)}
                  className="px-4 md:py-1.5 block rounded border-[2px] border-[#DEDDDD] w-full text-sm text-gray-600"
                />
                {errors.makkahContact1Name && <p className="text-red-500 text-xs">{errors.makkahContact1Name}</p>}
              </div>
              <div className="md:w-1/2 space-y-1">
                <label className="font-medium lg:text-[13px] md:text-[12px] text-[10px] text-[#4B465C] opacity-80 py-1.5">
                  Contact Number
                </label>
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
            <div className="lg:flex items-center gap-5">
              <div className="lg:w-1/2 space-y-1">
                <label className="font-medium lg:text-[13px] md:text-[12px] text-[10px] text-[#4B465C] opacity-80 py-1.5">
                  Contact name
                </label>
                <input
                  type="text"
                  value={formData.makkahContact2Name}
                  onChange={(e) => handleInputChange('makkahContact2Name', e.target.value)}
                  onBlur={(e) => validateField('makkahContact2Name', e.target.value)}
                  className="px-4 md:py-1.5 block rounded border-[2px] border-[#DEDDDD] w-full text-sm text-gray-600"
                />
                {errors.makkahContact2Name && <p className="text-red-500 text-xs">{errors.makkahContact2Name}</p>}
              </div>
              <div className="md:w-1/2 space-y-1">
                <label className="font-medium lg:text-[13px] md:text-[12px] text-[10px] text-[#4B465C] opacity-80 py-1.5">
                  Contact Number
                </label>
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
        <div className="bg-white border-[1px] 2xl:w-[1000px] w-full my-3 mx-auto rounded-md p-6">
          <label
            htmlFor="customerNote"
            className="text-sm text-gray-500 text-light"
          >
            Special Note for Customer
          </label>
          <textarea
            id="customerNote"
            className="w-full mt-1 text-sm text-gray-600 h-52 p-4 border border-gray-300 rounded-md resize-none"
            placeholder="Write about your transport arrangement - Transport booking # - Seat # - etc."
            value={formData.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            onBlur={(e) => validateField('note', e.target.value)}
          />
          {errors.note && <p className="text-red-500 text-xs">{errors.note}</p>}
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

export default TransportArrangementForm;
