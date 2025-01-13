import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { NumericFormat } from "react-number-format";
import madinaJson from "../../../..//Madina_Hotels.json"; // Ensure correct import path
import makkahJson from "../../../..//Makkah_Hotels.json"; // Ensure correct import path

const fetchHotelImages = (hotelName, hotelCity) => {
  const hotels = hotelCity === "Mecca" ? makkahJson : madinaJson;
  const hotel = hotels.find(hotel => hotel.hotel_Name === hotelName);
  return hotel ? [hotel.image1, hotel.image2, hotel.image3, hotel.image4] : [];
};

const PackageList = ({
  packages,
  currentPage,
  onPageChange,
  packagesPerPage,
  error,
}) => {
  const totalPackages = packages.length;
  const totalPages = Math.ceil(totalPackages / packagesPerPage);
  const currentPackages = packages.slice(
    (currentPage - 1) * packagesPerPage,
    currentPage * packagesPerPage
  );
  const navigate = useNavigate();

  const handleCardClick = (partnerSessionToken, huzToken) => {
    navigate(
      `/packagedetails?partnerSessionToken=${partnerSessionToken}&huzToken=${huzToken}`
    );
  };

  return (
    <div>
      {error ? (
        <div className="flex justify-center items-center h-full">
          <div
            className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative max-w-md mx-auto"
            role="alert"
          >
            <strong className="font-bold">Notice:</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {currentPackages.map((packageItem, index) => (
              <div
                key={index}
                className="items-center flex flex-col bg-white shadow-lg rounded-lg"
                onClick={() =>
                  handleCardClick(
                    packageItem.partner_session_token,
                    packageItem.huz_token
                  )
                }
              >
                <div className="flex-shrink-0 w-full h-48">
                  <Swiper spaceBetween={10} slidesPerView={1}>
                    {packageItem.hotel_info_detail.flatMap((hotel) =>
                      fetchHotelImages(hotel.hotel_name, hotel.hotel_city).map((photo, photoIndex) => (
                        <SwiperSlide key={photoIndex}>
                          <img
                            className="w-full h-48 rounded-t-lg object-cover"
                            src={photo}
                            alt={hotel.hotel_name}
                          />
                        </SwiperSlide>
                      ))
                    )}
                  </Swiper>
                </div>
                <div className="flex flex-col p-4 mx-auto w-full mt-4 lg:mt-0">
                  <div className="">
                    <h2 className="text-md font-semibold text-[#4b465c]">
                      {packageItem.package_name}
                    </h2>
                    <p className="text-gray-600 text-xs">
                      {new Date(packageItem.start_date).toLocaleDateString()} to{" "}
                      {new Date(packageItem.end_date).toLocaleDateString()}
                    </p>
                    <div className="font-bold">
                      <NumericFormat
                        value={packageItem.package_cost}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"PKR "}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <nav className="block">
              <ul className="flex pl-0 rounded list-none flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li
                      key={page}
                      className="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1"
                    >
                      <button
                        onClick={() => onPageChange(page)}
                        className={`${
                          currentPage === page
                            ? "bg-[#00936C] text-white"
                            : "bg-white text-[#00936C]"
                        } border border-white hover:bg-green-700 hover:text-white flex items-center justify-center w-full h-full rounded-full`}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default PackageList;
