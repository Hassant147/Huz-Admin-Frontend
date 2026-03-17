import React, { useState, useRef, useContext, useMemo } from 'react';
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

  const actionBlockedReason = useMemo(() => {
    if (booking?.actions?.canTakeDecision) {
      return '';
    }

    return 'This booking is not actionable yet.';
  }, [booking]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!booking) {
      toast.error('Booking details are not available.');
      return;
    }

    if (!booking?.actions?.canTakeDecision) {
      toast.error(actionBlockedReason || 'This booking is not actionable yet.');
      return;
    }
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

    if (hasError) {
      return;
    }

    setLoading(true);

    try {
      await updateBookingStatus(
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
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  if (!booking) {
    return <div>Loading booking details...</div>;
  }

  if (actionBlockedReason) {
    return (
      <div className="p-4 bg-white border border-gray-300 shadow-sm rounded-lg">
        <h2 className="text-lg font-medium text-gray-600 mb-2">Action unavailable</h2>
        <p className="text-sm text-[#b42318]">{actionBlockedReason}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-300 shadow-sm rounded-lg">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-lg font-medium text-gray-600 mb-2">Operator decision</h2>
      <p className="mb-4 text-sm text-gray-500">
        This booking is ready for admin/operator review. Choose whether fulfillment should begin now
        or whether the customer must correct traveler details first.
      </p>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-sm font-normal text-gray-700">Choose the next workflow action</label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="status"
                value="IN_FULFILLMENT"
                checked={status === 'IN_FULFILLMENT'}
                onChange={(e) => setStatus(e.target.value)}
                className="form-radio text-green-500"
              />
              <span className="ml-2 text-xs font-normal text-gray-600">Approve and move into fulfillment</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="status"
                value="OPERATOR_OBJECTION"
                checked={status === 'OPERATOR_OBJECTION'}
                onChange={(e) => setStatus(e.target.value)}
                className="form-radio text-red-500"
              />
              <span className="ml-2 text-xs font-normal text-gray-600">Request traveler correction</span>
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
            placeholder="Add the note that should explain this decision"
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
        {loading ? <ClipLoader size={20} color="#fff" /> : 'Save decision'}
      </button>
    </div>
  );
};

export default Pending;
