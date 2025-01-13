import React, { useState, useRef, useContext } from 'react';
import { updateBookingStatus } from '../../../../utility/Api';
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { BookingContext } from '../../../../context/BookingContext';

const Pending = ({ booking }) => {
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [remarksError, setRemarksError] = useState('');
  const { partner_session_token } = JSON.parse(localStorage.getItem('SignedUp-User-Profile'));
  const { fetchBookingDetails } = useContext(BookingContext);
  const formRef = useRef(null);
  const [selectedStatus, setSelectedStatus] = useState('Active');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let hasError = false;

    if (!status) {
      setStatusError('Please select a status.');
      hasError = true;
    } else {
      setStatusError('');
    }

    if (!remarks) {
      setRemarksError('Please provide your remarks.');
      hasError = true;
    } else {
      setRemarksError('');
    }

    if (!booking) {
      toast.error('Booking details are not available.');
      setLoading(false);
      return;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const updatedBooking = await updateBookingStatus(
        partner_session_token,
        booking.booking_number,
        status,
        remarks
      );
      fetchBookingDetails(booking.booking_number); // Refresh the booking details
      toast.success('Booking status updated successfully!');
    } catch (error) {
      console.error('API call failed:', error);
      toast.error('Failed to update booking status.');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  if (!booking) {
    return <div>Loading booking details...</div>;
  }

  return (
    <div className="p-4 bg-white border border-gray-300 shadow-sm rounded-lg">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-lg font-medium text-gray-600 mb-4">Your action</h2>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-sm font-normal text-gray-700">Which kind of option you want to choose?</label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="status"
                value="Active"
                checked={status === 'Active'}
                onChange={(e) => setStatus(e.target.value)}
                className="form-radio text-green-500"
              />
              <span className="ml-2 text-xs font-normal text-gray-600">Accept & In-Progress</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="status"
                value="Objection"
                checked={status === 'Objection'}
                onChange={(e) => setStatus(e.target.value)}
                className="form-radio text-red-500"
              />
              <span className="ml-2 text-xs font-normal text-gray-600">Objection ?</span>
            </label>
          </div>
          {statusError && <p className="text-red-500 text-xs mt-1">{statusError}</p>}
        </div>
        <div className="mb-4">
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded w-full text-xs font-normal text-gray-700"
            rows="4"
            placeholder="Write about your remarks"
            style={{ '::placeholder': { fontSize: '12px', fontWeight: 'normal', color: '#718096' } }}
          ></textarea>
          {remarksError && <p className="text-red-500 text-xs mt-1">{remarksError}</p>}
        </div>
      </form>
      <button
        type="button"
        onClick={handleButtonClick}
        className="bg-[#00936C] text-sm text-normal w-full text-white py-2 rounded-md flex items-center justify-center"
        disabled={loading}
      >
        {loading ? <ClipLoader size={20} color="#fff" /> : 'Submit your decision'}
      </button>
    </div>
  );
};

export default Pending;
