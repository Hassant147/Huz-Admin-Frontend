import React, { useState, useEffect } from 'react';
import { fetchBookingStatistics } from '../../../../utility/Api';
import { AppCard } from "../../../../components/ui";
import { getPartnerSessionToken } from "../../../../utility/session";

const BookingCard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBookings = async () => {
            try {
                const data = await fetchBookingStatistics(getPartnerSessionToken());
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
    }, []);

    const getStatusClass = (status) => {
        if (status === "Active" || status === "Completed") return "text-[#0A8F67]";
        if (status === "Rejected" || status === "Closed") return "text-[#D44444]";
        return "text-[#364152]";
    };

    if (loading) {
        return (
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                    <AppCard key={index} className="animate-pulse">
                        <div className="h-5 w-12 rounded bg-slate-200" />
                        <div className="mt-3 h-4 w-24 rounded bg-slate-200" />
                    </AppCard>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {bookings.map((booking, index) => (
                <AppCard className="text-center flex-1 min-w-[100px] border-slate-200" key={index}>
                    <div className={`text-2xl font-bold ${getStatusClass(booking.status)}`}>
                        {booking.count}
                    </div>
                    <div className="text-sm text-ink-500">
                        {booking.status} Bookings
                    </div>
                </AppCard>
            ))}
        </div>
    );
};

export default BookingCard;
