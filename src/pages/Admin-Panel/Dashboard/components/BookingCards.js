import React, { useState, useEffect } from 'react';
import { fetchBookingStatistics } from '../../../../utility/Api';
import { AppCard } from "../../../../components/ui";
import { getPartnerSessionToken } from "../../../../utility/partnerSession";

const BOOKING_STAT_CARDS = [
    { key: "HOLD", label: "Hold", tone: "text-[#B54708]" },
    {
        key: "TRAVELER_DETAILS_PENDING",
        label: "Traveler Details Pending",
        tone: "text-[#1D4ED8]",
    },
    {
        key: "AWAITING_FINAL_PAYMENT",
        label: "Awaiting Final Payment",
        tone: "text-[#B54708]",
    },
    {
        key: "READY_FOR_OPERATOR",
        label: "Ready for Operator",
        tone: "text-[#067A5D]",
    },
    { key: "IN_FULFILLMENT", label: "In Fulfillment", tone: "text-[#067A5D]" },
    { key: "READY_FOR_TRAVEL", label: "Ready for Travel", tone: "text-[#475569]" },
    { key: "COMPLETED", label: "Completed", tone: "text-[#475569]" },
    { key: "CANCELLED", label: "Cancelled", tone: "text-[#D44444]" },
    { key: "EXPIRED", label: "Expired", tone: "text-[#D44444]" },
];

const toNumber = (value) => {
    const number = Number(value || 0);
    return Number.isFinite(number) ? number : 0;
};

const BookingCard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBookings = async () => {
            try {
                const data = await fetchBookingStatistics(getPartnerSessionToken());
                const bookingData = BOOKING_STAT_CARDS.map((card) => ({
                    count: toNumber(data?.[card.key]),
                    status: card.label,
                    tone: card.tone,
                }));
                setBookings(bookingData);
            } catch (error) {
                console.error('Error fetching booking data:', error);
            } finally {
                setLoading(false);
            }
        };

        getBookings();
    }, []);

    if (loading) {
        return (
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                {BOOKING_STAT_CARDS.map((card) => (
                    <AppCard key={card.key} className="animate-pulse">
                        <div className="h-5 w-12 rounded bg-slate-200" />
                        <div className="mt-3 h-4 w-24 rounded bg-slate-200" />
                    </AppCard>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {bookings.map((booking) => (
                <AppCard className="text-center flex-1 min-w-[100px] border-slate-200" key={booking.status}>
                    <div className={`text-2xl font-bold ${booking.tone || "text-[#364152]"}`}>
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
