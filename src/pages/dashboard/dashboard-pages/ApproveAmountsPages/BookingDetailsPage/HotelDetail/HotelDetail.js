import React, { useContext, useMemo } from "react";
import { BookingContext } from "../../../../../../context/BookingContext";
import phone from "../../../../../../assets/booking/phone.svg";
import user from "../../../../../../assets/booking/user.svg";
import {
  AppCard,
  AppEmptyState,
  AppSectionHeader,
} from "../../../../../../components/ui";
import errorIcon from "../../../../../../assets/error.svg";
import { withFallback } from "../bookingDetailsUtils";

const HotelDetails = ({ booking: bookingProp }) => {
  const { booking: contextBooking } = useContext(BookingContext);
  const booking = bookingProp || contextBooking;

  const hotelDetails = useMemo(() => {
    const details = booking?.booking_hotel_and_transport_details || [];
    return details.filter((detail) => detail.detail_for === "Hotel");
  }, [booking]);

  return (
    <AppCard className="border-slate-200">
      <div className="app-content-stack">
        <AppSectionHeader
          title="Hotel Details"
          subtitle="Shared hotel coordinators for Makkah and Madinah"
        />

        {hotelDetails.length ? (
          <div className="space-y-3">
            {hotelDetails.map((detail, index) => (
              <div key={`hotel-detail-${index}`} className="grid gap-3 md:grid-cols-2">
                {detail.mecca_name ? (
                  <HotelCard
                    location="Makkah"
                    name={detail.mecca_name}
                    number={detail.mecca_number}
                    note={detail.comment_1 || detail.comment_2}
                  />
                ) : null}

                {detail.madinah_name ? (
                  <HotelCard
                    location="Madinah"
                    name={detail.madinah_name}
                    number={detail.madinah_number}
                    note={detail.comment_1 || detail.comment_2}
                  />
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <AppEmptyState
            icon={<img src={errorIcon} alt="" className="h-6 w-6" />}
            title="No hotel details"
            message="No hotel arrangement records were uploaded for this booking."
          />
        )}
      </div>
    </AppCard>
  );
};

const HotelCard = ({ location, name, number, note }) => {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">{location}</p>

      <div className="mt-2 space-y-2">
        <DetailRow icon={user} label="Contact Person" value={name} />
        <DetailRow icon={phone} label="Phone Number" value={number} />
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">Customer Note</p>
        <p className="mt-1 text-sm text-ink-700">{withFallback(note, "No note shared.")}</p>
      </div>
    </article>
  );
};

const DetailRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-2">
      <img src={icon} alt="" className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">{label}</p>
        <p className="text-sm text-ink-700">{withFallback(value)}</p>
      </div>
    </div>
  );
};

export default HotelDetails;

