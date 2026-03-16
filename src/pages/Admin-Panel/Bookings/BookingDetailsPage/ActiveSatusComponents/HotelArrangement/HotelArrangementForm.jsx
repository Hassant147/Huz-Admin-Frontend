import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import {
  postTransportDetails,
  updateTransportDetails,
} from "../../../../../../utility/Api";

const buildInitialHotelItems = (booking) => {
  const cards = Array.isArray(booking?.hotel_cards) ? booking.hotel_cards : [];
  if (cards.length > 0) {
    return cards.map((card) => ({
      city: card.cityKey || card.cityLabel,
      package_hotel_id: card.packageHotel?.id || "",
      hotel_name: card.confirmed?.hotelName || "",
      contact_name: card.confirmed?.contactName || "",
      contact_phone: card.confirmed?.contactPhone || "",
      note: card.confirmed?.note || "",
      packageSummary: {
        hotelName: card.packageHotel?.hotelName || "",
        rating: card.packageHotel?.rating || "",
        distance: card.packageHotel?.distance || "",
      },
      cityLabel: card.cityLabel || card.cityKey || "Hotel",
    }));
  }

  return [
    {
      city: "makkah",
      package_hotel_id: "",
      hotel_name: "",
      contact_name: "",
      contact_phone: "",
      note: "",
      packageSummary: {
        hotelName: "",
        rating: "",
        distance: "",
      },
      cityLabel: "Makkah",
    },
  ];
};

const hasHotelSharedDetails = (item = {}) =>
  [item.hotel_name, item.contact_name, item.contact_phone, item.note].some((value) =>
    String(value || "").trim()
  );

const HotelArrangementForm = ({ isEditing, booking }) => {
  const [hotelItems, setHotelItems] = useState(() => buildInitialHotelItems(booking));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setHotelItems(buildInitialHotelItems(booking));
  }, [booking]);

  const updateItemField = (index, field, value) => {
    setHotelItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sanitizedItems = hotelItems
      .map((item) => ({
        city: item.city,
        package_hotel_id: item.package_hotel_id || undefined,
        hotel_name: item.hotel_name.trim(),
        contact_name: item.contact_name.trim(),
        contact_phone: item.contact_phone.trim(),
        note: item.note.trim(),
      }))
      .filter(hasHotelSharedDetails);

    if (sanitizedItems.length === 0) {
      toast.error("Add at least one hotel confirmation before saving.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        partner_session_token: booking.partner_session_token,
        booking_number: booking.booking_number,
        detail_for: "Hotel",
        hotel_items: JSON.stringify(sanitizedItems),
      };

      if (isEditing) {
        await updateTransportDetails(payload);
        toast.success("Hotel arrangement updated successfully.");
      } else {
        await postTransportDetails(payload);
        toast.success("Hotel arrangement shared successfully.");
      }

      navigate(-1);
    } catch (error) {
      console.error("Failed to submit hotel arrangement:", error);
      toast.error("Failed to save hotel arrangement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-4">
        {hotelItems.map((item, index) => (
          <div key={`${item.city}-${index}`} className="rounded bg-white border p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-gray-700 text-lg font-medium">{item.cityLabel}</h1>
                <p className="text-sm text-gray-500">
                  Package hotel defaults stay visible. Add traveler-facing contacts or notes only when needed.
                </p>
              </div>
              {(item.packageSummary.hotelName ||
                item.packageSummary.rating ||
                item.packageSummary.distance) && (
                <div className="rounded-md bg-[#f7faf8] px-4 py-3 text-sm text-gray-600">
                  <p className="font-medium text-gray-700">Package default</p>
                  <p>{item.packageSummary.hotelName || "No default hotel"}</p>
                  <p>
                    {[item.packageSummary.rating, item.packageSummary.distance]
                      .filter(Boolean)
                      .join(" • ") || "No extra package metadata"}
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {!item.packageSummary.hotelName ? (
                <div>
                  <label className="text-sm text-gray-500">Hotel name</label>
                  <input
                    type="text"
                    value={item.hotel_name}
                    onChange={(event) =>
                      updateItemField(index, "hotel_name", event.target.value)
                    }
                    className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
                  />
                </div>
              ) : (
                <div className="rounded-md border border-[#dce7e1] bg-[#f7faf8] px-4 py-3 text-sm text-gray-600">
                  Hotel name already comes from the package. Use the fields below only for traveler-facing desk contacts, phone numbers, or notes.
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500">Contact name</label>
                <input
                  type="text"
                  value={item.contact_name}
                  onChange={(event) =>
                    updateItemField(index, "contact_name", event.target.value)
                  }
                  className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Contact phone</label>
                <input
                  type="tel"
                  value={item.contact_phone}
                  onChange={(event) =>
                    updateItemField(index, "contact_phone", event.target.value)
                  }
                  className="mt-1 block w-full rounded border-[2px] border-[#DEDDDD] px-4 py-2 text-sm text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Operator note</label>
              <textarea
                value={item.note}
                onChange={(event) => updateItemField(index, "note", event.target.value)}
                className="mt-1 h-32 w-full rounded border border-gray-300 p-4 text-sm text-gray-700"
                placeholder="Keep package defaults and booking-specific hotel confirmations clearly separated."
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="flex h-[50px] w-full items-center justify-center rounded-md bg-[#00936C] px-4 py-2 text-sm font-medium text-white hover:bg-[#00936ce0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <ClipLoader color="white" size={20} /> : "Share with Customer"}
        </button>
      </form>
    </div>
  );
};

export default HotelArrangementForm;
