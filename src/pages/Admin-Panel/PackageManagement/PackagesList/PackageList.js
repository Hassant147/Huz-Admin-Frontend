import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { NumericFormat } from "react-number-format";
import madinaJson from "../../../..//Madina_Hotels.json"; // Ensure correct import path
import makkahJson from "../../../..//Makkah_Hotels.json"; // Ensure correct import path
import { AppCard } from "../../../../components/ui";

const fetchHotelImages = (hotelName, hotelCity) => {
  const hotels = hotelCity === "Mecca" ? makkahJson : madinaJson;
  const hotel = hotels.find((item) => item.hotel_Name === hotelName);
  return hotel ? [hotel.image1, hotel.image2, hotel.image3, hotel.image4] : [];
};

const PackageList = ({ packages, error }) => {
  const navigate = useNavigate();

  const handleCardClick = (partnerSessionToken, huzToken) => {
    navigate(
      `/packagedetails?partnerSessionToken=${partnerSessionToken}&huzToken=${huzToken}`
    );
  };

  const renderSlides = (packageItem) => {
    const slides = (packageItem.hotel_info_detail || []).flatMap((hotel) =>
      fetchHotelImages(hotel.hotel_name, hotel.hotel_city).map((photo, photoIndex) => (
        <SwiperSlide key={`${hotel.hotel_name}-${photoIndex}`}>
          <img
            className="h-48 w-full object-cover"
            src={photo}
            alt={hotel.hotel_name}
          />
        </SwiperSlide>
      ))
    );

    if (slides.length > 0) {
      return slides;
    }

    return (
      <SwiperSlide>
        <div className="flex h-48 items-center justify-center text-sm text-ink-500">
          No preview image
        </div>
      </SwiperSlide>
    );
  };

  return (
    <div>
      {error ? (
        <AppCard className="max-w-md mx-auto">
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Notice:</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </AppCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((packageItem) => (
            <article
              key={packageItem.huz_token}
              className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              onClick={() =>
                handleCardClick(
                  packageItem.partner_session_token,
                  packageItem.huz_token
                )
              }
            >
              <div className="h-48 w-full bg-slate-100">
                <Swiper spaceBetween={10} slidesPerView={1}>{renderSlides(packageItem)}</Swiper>
              </div>
              <div className="space-y-2 p-4">
                <h2 className="truncate text-base font-semibold text-[#243447]">
                  {packageItem.package_name}
                </h2>
                <p className="text-xs text-ink-500">
                  {new Date(packageItem.start_date).toLocaleDateString()} to{" "}
                  {new Date(packageItem.end_date).toLocaleDateString()}
                </p>
                <div className="font-bold text-brand-600">
                  <NumericFormat
                    value={packageItem.package_cost}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"PKR "}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackageList;
