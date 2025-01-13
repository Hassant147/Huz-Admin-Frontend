import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar } from "react-icons/fa";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./swiper.css"; // Make sure to import your CSS file
import madinaJson from "../../../..//Madina_Hotels.json"; // Ensure correct import path
import makkahJson from "../../../..//Makkah_Hotels.json"; // Ensure correct import path

const fetchHotelImages = (hotelName, hotelCity) => {
  const hotels = hotelCity === "Mecca" ? makkahJson : madinaJson;
  const hotel = hotels.find(hotel => hotel.hotel_Name === hotelName);
  return hotel ? [hotel.image1, hotel.image2, hotel.image3, hotel.image4] : [];
};

const renderStars = (rating) => {
  const filledStars = [];
  const remainingStars = [];

  for (let i = 0; i < rating; i++) {
    filledStars.push(<FaStar key={i} className="fill-[#00936c]" />);
  }

  for (let i = rating; i < 5; i++) {
    remainingStars.push(<FaStar key={i} />);
  }

  return (
    <div className="flex">
      {filledStars}
      {remainingStars}
    </div>
  );
};

const renderCheckHotel = (condition, name) => {
  return (
    <div className={` ${condition ? " text-[14px]" : "hidden"}`}>
      <p className="text-sm">{condition ? name : ""}</p>
    </div>
  );
};

const HotelCard = ({ hotel }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const hotelImages = fetchHotelImages(hotel.hotel_name, hotel.hotel_city);
    setImages(hotelImages);
  }, [hotel.hotel_name, hotel.hotel_city]);

  return (
    <div className="">
      <div className="space-y-5 w-full">
        <div>
          <p className="text-[24px] font-[600] pt-5">
            Hotel in {hotel.hotel_city}
          </p>
          <div className="flex items-center gap-3">
            <p className="text-[18px] font-[600]">{hotel.hotel_name}</p>
            {renderStars(hotel.hotel_rating)}
          </div>
          <div className="flex-row  gap-2 md:gap-4 text-[12px] space-y-1.5 md:text-sm font-[500]">
            <div className="flex gap-2">
              <p>{hotel.room_sharing_type} Room</p>
              {hotel.hotel_city === "Mecca" ? (
                <p>
                  {hotel.hotel_distance} {hotel.distance_type} - from Kaaba
                </p>
              ) : hotel.hotel_city === "Madinah" ? (
                <p>
                  {hotel.hotel_distance} {hotel.distance_type} - from Masjid
                  Nabwi
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {renderCheckHotel(
                hotel.is_shuttle_services_included,
                "Shuttle Service"
              )}{" "}
              {renderCheckHotel(hotel.is_air_condition, "Air Condition")}
              {renderCheckHotel(hotel.is_Television, "Television")}
              {renderCheckHotel(hotel.is_wifi, "Wifi")}
              {renderCheckHotel(hotel.is_elevator, "Elevator")}
              {renderCheckHotel(hotel.is_attach_bathroom, "Attach Bathroom")}
              {renderCheckHotel(
                hotel.is_washroom_amenities,
                "Washroom Amenities"
              )}
              {renderCheckHotel(hotel.is_english_toilet, "English Toilet")}
              {renderCheckHotel(hotel.is_indian_toilet, "Indian Toilet")}
              {renderCheckHotel(hotel.is_laundry, "Laundry")}
            </div>
          </div>
        </div>
        <div className="w-full relative">
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[Navigation]}
            className="mySwiper rounded-lg swiper-container"
            breakpoints={{
              1440: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              425: {
                slidesPerView: 1,
                spaceBetween: 30,
              },
            }}
            scrollbar={{ draggable: true }}
          >
            {images.map((photo, photoIndex) => (
              <SwiperSlide key={photoIndex}>
                <img
                  src={photo}
                  alt={`${hotel.hotel_name}`}
                  className="w-full h-[225px] object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

const HotelDetailsSection = ({ packageDetail }) => (
  <div className="">
    {packageDetail &&
    packageDetail.hotel_detail &&
    packageDetail.hotel_detail.length > 0 ? (
      packageDetail.hotel_detail.map((hotel, index) => (
        <div key={index} className="mt-4 w-full">
          <HotelCard hotel={hotel} />
        </div>
      ))
    ) : (
      <p className="text-center w-full mt-4">No hotel details available.</p>
    )}
  </div>
);

export default HotelDetailsSection;
