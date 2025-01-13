import React, { useState, useEffect } from 'react';
import { fetchBookingStatistics } from '../../../../utility/Api';

const BookingCard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));

    useEffect(() => {
        const getBookings = async () => {
            try {
                const data = await fetchBookingStatistics(profile.partner_session_token);
                const bookingData = [
                    { count: data.Pending, status: 'Pending' },
                    { count: data.Active, status: 'Active' },
                    { count: data.Completed, status: 'Completed' },
                    { count: data.Closed, status: 'Closed' },
                    { count: data.Rejected, status: 'Rejected' }
                ];
                setBookings(bookingData);
            } catch (error) {
                console.error('Error fetching booking data:', error);
            } finally {
                setLoading(false);
            }
        };

        getBookings();
    }, [profile.partner_session_token]);

    const getColor = (count) => {
        if (count > 0) return 'text-[#28C76F]';
        if (count < 0) return 'text-[#EA5455]';
        return 'text-gray-500';
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {bookings.map((booking, index) => (
                <div className="bg-white rounded-lg shadow-md p-4 text-center flex-1 min-w-[100px] " key={index}>
                    <div className="text-lg font-light">
                        {booking.count} <span className={getColor(booking.count)}></span>
                    </div>
                    <div className="text-sm text-gray-500">
                        {booking.status} Bookings
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookingCard;
