import React, { useState, useEffect, useRef, useContext } from "react";
import { FaStar } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { RiCheckboxIndeterminateLine } from "react-icons/ri";
import { TbCheckbox } from "react-icons/tb";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./swiper.css";
import { NumericFormat } from "react-number-format";
import { getPackagesDetail } from "../../../../../utility/Api";
import Loader from "../../../../../components/loader";
import madinaJson from "../../../../../Madina_Hotels.json"; // Ensure correct import path
import makkahJson from "../../../../../Makkah_Hotels.json"; // Ensure correct import path
import { CurrencyContext } from "../../../../../utility/CurrencyContext";
import Header from "../../../../../components/Headers/Header";
import Footer from "../../../../../components/Footers/Footer";
// Function to fetch hotel images from JSON based on hotel name and city
const fetchHotelImages = (hotelName, hotelCity) => {
  const hotels = hotelCity === "Mecca" ? makkahJson : madinaJson;
  const hotel = hotels.find((hotel) => hotel.hotel_Name === hotelName);
  return hotel ? [hotel.image1, hotel.image2, hotel.image3, hotel.image4] : [];
};

const DetailPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const { selectedCurrency, exchangeRates } = useContext(CurrencyContext);

  const packageId = searchParams.get("packageId");
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    // Scroll to top when the component mounts
    scrollToTop();

    // Scroll to top when the page is reloaded or navigated from another page
    window.addEventListener("beforeunload", scrollToTop);

    return () => {
      window.removeEventListener("beforeunload", scrollToTop);
    };
  }, []);
  const [packageDetail, setPackageDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPackages = async () => {
      const result = await getPackagesDetail(packageId);
      if (result.error) {
        setError(result.error);
      } else {
        setIsLoading(false);
        setPackageDetail(result.data[0]);
      }
    };

    fetchPackages();
  }, []);
  const [swiper, setSwiper] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const prevSlide = () => {
    if (
      swiper &&
      packageDetail &&
      packageDetail.hotel_detail &&
      packageDetail.hotel_detail.hotel_photos &&
      currentIndex > 0
    ) {
      swiper.slidePrev();
      setCurrentIndex(currentIndex - 1);
      updateButtonVisibility();
    }
  };

  const nextSlide = () => {
    if (
      swiper &&
      packageDetail &&
      packageDetail.hotel_detail &&
      packageDetail.hotel_detail.hotel_photos &&
      currentIndex < packageDetail.hotel_detail.hotel_photos.length - 1
    ) {
      swiper.slideNext();
      setCurrentIndex(currentIndex + 1);
      updateButtonVisibility();
    }
  };

  const updateButtonVisibility = () => {
    if (!swiper) return; // Handle potential initial 'swiper' undefined state

    prevButtonRef.current.classList.toggle(
      "hidden",
      currentIndex === 0 && !swiper.loop
    );
    nextButtonRef.current.classList.toggle(
      "hidden",
      currentIndex === packageDetail.hotel_detail.hotel_photos.length - 1
    );
  };

  const convertedCost =
    packageDetail && exchangeRates[selectedCurrency]
      ? (packageDetail.package_base_cost / exchangeRates["PKR"]) *
        exchangeRates[selectedCurrency]
      : packageDetail
      ? packageDetail.package_base_cost
      : 0; // Default value or handle the case where packageDetail is null
  const convertedCostForInfants =
    packageDetail && exchangeRates[selectedCurrency]
      ? (packageDetail.cost_for_infants / exchangeRates["PKR"]) *
        exchangeRates[selectedCurrency]
      : packageDetail
      ? packageDetail.cost_for_infants
      : 0; // Default value or handle the case where packageDetail is null
  const convertedCostForChild =
    packageDetail && exchangeRates[selectedCurrency]
      ? (packageDetail.cost_for_child / exchangeRates["PKR"]) *
        exchangeRates[selectedCurrency]
      : packageDetail
      ? packageDetail.cost_for_child
      : 0; // Default value or handle the case where packageDetail is null
  const convertedCostForSingleRoom =
    packageDetail && exchangeRates[selectedCurrency]
      ? (packageDetail.cost_for_single / exchangeRates["PKR"]) *
        exchangeRates[selectedCurrency]
      : packageDetail
      ? packageDetail.cost_for_single
      : 0; // Default value or handle the case where packageDetail is null
  const convertedCostForDouble =
    packageDetail && exchangeRates[selectedCurrency]
      ? (packageDetail.cost_for_double / exchangeRates["PKR"]) *
        exchangeRates[selectedCurrency]
      : packageDetail
      ? packageDetail.cost_for_double
      : 0; // Default value or handle the case where packageDetail is null
  const convertedCostForTriple =
    packageDetail && exchangeRates[selectedCurrency]
      ? (packageDetail.cost_for_triple / exchangeRates["PKR"]) *
        exchangeRates[selectedCurrency]
      : packageDetail
      ? packageDetail.cost_for_triple
      : 0; // Default value or handle the case where packageDetail is null
  const convertedCostForQuad =
    packageDetail && exchangeRates[selectedCurrency]
      ? (packageDetail.cost_for_quad / exchangeRates["PKR"]) *
        exchangeRates[selectedCurrency]
      : packageDetail
      ? packageDetail.cost_for_quad
      : 0; // Default value or handle the case where packageDetail is null
  const convertedCostForSharing =
    packageDetail && exchangeRates[selectedCurrency]
      ? (packageDetail.cost_for_sharing / exchangeRates["PKR"]) *
        exchangeRates[selectedCurrency]
      : packageDetail
      ? packageDetail.cost_for_sharing
      : 0; // Default value or handle the case where packageDetail is null
  const total_nights =
    packageDetail && packageDetail.mecca_nights + packageDetail.madinah_nights;
  const renderCheck = (condition, name) => {
    return (
      <div
        className={`flex gap-2 items-center ${
          condition ? "text-[#00936c] text-[14px]" : "hidden"
        }`}
      >
        <TbCheckbox
          className={`h-3 md:h-4 ${condition ? "" : "text-red-500"}`}
        />
        <p className="text-[14px] font-[500]">{condition ? name : ""}</p>
      </div>
    );
  };
  const renderCheckFalse = (condition, name) => {
    return (
      <div
        className={`flex gap-2 items-center ${
          condition ? "hidden" : "text-red-500 text-[14px]"
        }`}
      >
        <RiCheckboxIndeterminateLine
          className={`h-3 md:h-4 ${condition ? "" : "text-red-500"}`}
        />
        <p className="text-[14px] font-[500]">{condition ? "" : name}</p>
      </div>
    );
  };
  const renderCheckHotel = (condition, name) => {
    return (
      <div
        className={`flex gap-2 items-center ${
          condition ? " text-[14px] " : "hidden"
        }`}
      >
        <TbCheckbox
          className={`h-3 md:h-4 ${
            condition ? "text-[#00936c]" : "text-red-500"
          }`}
        />
        <p className="text-[14px] font-[500]">{condition ? name : ""}</p>
      </div>
    );
  };
  const renderHotelDetails = () => {
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

    return (
      <div className="">
        {packageDetail &&
          packageDetail.hotel_detail.map((hotel, index) => {
            const hotelImages = fetchHotelImages(
              hotel.hotel_name,
              hotel.hotel_city
            );
            return (
              <div key={index} className="space-y-5 w-full">
                <div className="space-y-1">
                  <p className="text-[18px] font-[600] pt-2">
                    Hotel in {hotel.hotel_city}
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="text-[18px] font-kd font-[600]">
                      {hotel.hotel_name}
                    </p>
                    {renderStars(hotel.hotel_rating)}
                  </div>
                  <div className="flex-row gap-2 md:gap-4 text-[12px] space-y-1.5 md:text-sm font-kd font-[400]">
                    <div className="flex gap-2">
                      <p>{hotel.room_sharing_type} Room</p>
                      {hotel.hotel_city === "Mecca" ? (
                        <p>
                          {hotel.hotel_distance} {hotel.distance_type} - from
                          Kaaba
                        </p>
                      ) : hotel.hotel_city === "Madinah" ? (
                        <p>
                          {hotel.hotel_distance} {hotel.distance_type} - from
                          Masjid Nabwi
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="grid grid-col-2 md:grid-cols-5 gap-1">
                      {renderCheckHotel(
                        hotel.is_shuttle_services_included,
                        "Shuttle Service"
                      )}
                      {renderCheckHotel(
                        hotel.is_air_condition,
                        "Air Condition"
                      )}
                      {renderCheckHotel(hotel.is_Television, "Television")}
                      {renderCheckHotel(hotel.is_wifi, "Wifi")}
                      {renderCheckHotel(hotel.is_elevator, "Elevator")}
                      {renderCheckHotel(
                        hotel.is_attach_bathroom,
                        "Attach Bathroom"
                      )}
                      {renderCheckHotel(
                        hotel.is_washroom_amenities,
                        "Washroom Amenities"
                      )}
                      {renderCheckHotel(
                        hotel.is_english_toilet,
                        "English Toilet"
                      )}
                      {renderCheckHotel(
                        hotel.is_indian_toilet,
                        "Indian Toilet"
                      )}
                      {renderCheckHotel(hotel.is_laundry, "Laundry")}
                    </div>
                  </div>
                </div>
                <div className="w-full relative">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    navigation={{
                      prevEl: ".swiper-button-prev",
                      nextEl: ".swiper-button-next",
                    }}
                    className="mySwiper swiper-container"
                    breakpoints={{
                      1440: { slidesPerView: 3, spaceBetween: 10 },
                      1024: { slidesPerView: 3, spaceBetween: 10 },
                      768: { slidesPerView: 3, spaceBetween: 30 },
                      425: { slidesPerView: 1, spaceBetween: 30 },
                    }}
                    scrollbar={{ draggable: true }}
                    onSwiper={(swiper) => setSwiper(swiper)}
                    onSlideChange={(swiper) =>
                      setCurrentIndex(swiper.activeIndex)
                    }
                  >
                    {hotelImages.map((photo, photoIndex) => (
                      <SwiperSlide key={photoIndex}>
                        <img
                          src={photo}
                          alt={`${hotel.hotel_name}`}
                          className="w-full h-[225px] object-cover rounded-lg"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="custom-navigation">
                    <div
                      className="swiper-button-prev swiper-container hidden"
                      ref={prevButtonRef}
                      onClick={prevSlide}
                      style={{ top: 100 }}
                    ></div>
                    <div
                      className="swiper-button-next swiper-container hidden"
                      ref={nextButtonRef}
                      onClick={nextSlide}
                      style={{ top: 100 }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  };
  return (
    <div>
      <Header />
      {isLoading ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader />
        </div>
      ) : (
        <div className="w-[85%] mx-auto mt-12 mb-12 text-[#484848] block lg:flex gap-5">
          <div className="md:w-1/4 h-full space-y-4">
            <div className=" block ">
              <div className="hidden lg:block p-4 py-6 bg-[#F0F6F4] w-full rounded-t-md space-y-3">
                <div>
                  {packageDetail && packageDetail.company_details && (
                    <div className="text-center space-y-2">
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}${packageDetail.company_details.company_logo}`}
                        alt={`${packageDetail.company_details.company_name}`}
                        className="w-[100px] h-[100px] object-cover rounded-full mx-auto border-[2px] border-white"
                      />
                      <div>
                        <label className="text-lg font-bold">
                          {/* {company_details.company_name} */}
                          {packageDetail.company_details.company_name}
                        </label>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {packageDetail.company_details.total_experience} years
                          of experience
                        </p>
                      </div>
                      <div>
                        <label className="justify-start text-sm">
                          {packageDetail.company_details.company_bio
                            .split(" ")
                            .slice(0, 20)
                            .join(" ")}
                          ...
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full p-2 mb-2 md:mb-0 text-center rounded-md md:rounded-b-md lg:rounded-t-none bg-[#00936c] text-white text-sm">
                <a
                  // href={`/profile/?profile_id=${
                  //   packageDetail && packageDetail.partner_session_token
                  // }`}
                  href="#"
                >
                  Company Profile
                </a>
              </div>
            </div>
          </div>
          <div className="text-[#4B465C] space-y-5 w-full lg:w-[75%]">
            <div className="bg-white rounded-lg space-y-3">
              {packageDetail && (
                <div className="space-y-3">
                  <div className="space-y-3">
                    <div className="md:flex md:justify-between items-center space-y-2 md:space-y-0">
                      <div>
                        <p className="text-[24px] md:text-[32px] font-[600]">
                          {packageDetail.package_name}
                        </p>
                        <p className="text-[14px] font-kd font-[500]">
                          {new Date(
                            packageDetail.start_date
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          to{" "}
                          {new Date(packageDetail.end_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="space-y-2 md:space-y-0 md:flex md:gap-2">
                        <button className="flex gap-2 items-center p-2 rounded-sm bg-[#F2F2F3] px-4">
                          <IoShareSocialOutline />
                          <p className="text-[14px] font-[600]">Share</p>
                        </button>
                        {packageDetail.is_package_open_for_other_date ? (
                          <div className="text-[14px] rounded-sm font-[600] p-2 mt-2 bg-[#f2f2f3] text-[#484848] flex items-center gap-1.5">
                            <p>Flexible</p>
                            <TbCheckbox className="text-[#00936c]" />
                          </div>
                        ) : (
                          <div className="text-[14px] rounded-sm font-[600] p-2 mt-2 bg-[#f2f2f3] text-[#484848] flex items-center gap-1.5">
                            <p>Flexible</p>
                            <RiCheckboxIndeterminateLine className="text-red-500" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className=" xl:flex justify-between gap-2">
                      <div className="w-full">
                        <p className="text-[14px] md:text-[16px] font-kd font-[500]">
                          {packageDetail.description}
                        </p>
                      </div>
                      <div className="mt-3 xl:mt-0 xl:w-[45%] space-y-1.5">
                        <p className="text-[14px] font-[600] ">
                          {total_nights} days package,{" "}
                          {packageDetail.mecca_nights} day Makkah and{" "}
                          {packageDetail.madinah_nights} day Madinah.
                        </p>
                        <div>
                          <p className="text-[#00936c] text-[26px] md:text-[30px] font-kd font-[700]">
                            <NumericFormat
                              value={convertedCost}
                              displayType={"text"}
                              thousandSeparator
                              prefix={`${selectedCurrency} `}
                              decimalScale={2}
                              fixedDecimalScale={true}
                            />
                            <span className="text-sm font-normal text-[#4b465c]">
                              per person
                            </span>{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 w-full pt-2 ">
                    <div className="w-full">
                      <div className="space-y-2 md:space-y-0 md:flex gap-3 bg-[#F2F2F3] p-3 rounded-md">
                        <p className="text-[18px] font-[600]">Included:</p>
                        {renderCheck(packageDetail.is_visa_included, "Visa")}
                        {renderCheck(
                          packageDetail.is_insurance_included,
                          "Insurance"
                        )}
                        {renderCheck(
                          packageDetail.is_airport_reception_included,
                          "Airport Reception"
                        )}
                        {renderCheck(
                          packageDetail.is_tour_guide_included,
                          "Tour Guide"
                        )}{" "}
                        {renderCheck(
                          packageDetail.is_breakfast_included,
                          "Breakfast"
                        )}
                        {renderCheck(packageDetail.is_lunch_included, "Lunch")}
                        {renderCheck(
                          packageDetail.is_dinner_included,
                          "Dinner"
                        )}
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="md:flex gap-3 bg-[#F2F2F3] p-3 rounded-md">
                        <p className="text-[18px] font-[600]">Excluded:</p>
                        {renderCheckFalse(
                          packageDetail.is_visa_included,
                          "Visa"
                        )}
                        {renderCheckFalse(
                          packageDetail.is_insurance_included,
                          "Insurance"
                        )}
                        {renderCheckFalse(
                          packageDetail.is_airport_reception_included,
                          "Airport Reception"
                        )}
                        {renderCheckFalse(
                          packageDetail.is_tour_guide_included,
                          "Tour Guide"
                        )}
                        {renderCheckFalse(
                          packageDetail.is_breakfast_included,
                          "Breakfast"
                        )}
                        {renderCheckFalse(
                          packageDetail.is_lunch_included,
                          "Lunch"
                        )}
                        {renderCheckFalse(
                          packageDetail.is_dinner_included,
                          "Dinner"
                        )}
                      </div>
                    </div>
                  </div>
                  {renderHotelDetails()}
                  <div className="space-y-3 pt-5">
                    <div>
                      {packageDetail.airline_detail &&
                        packageDetail.airline_detail.map((airline, index) => (
                          <div key={index} className="">
                            <div className="flex gap-1.5 items-center">
                              {/* <TbCheckbox className="h-3 md:h-4 mt-1 text-[#00936c]" /> */}
                              <p className="text-[18px] font-[600] ">
                                {airline.airline_name}
                              </p>
                              <p className="text-[20px] font-[700]">Flight </p>
                            </div>
                            <div className="md:flex gap-10">
                              <div className="flex gap-3 items-center space-y-1">
                                <TbCheckbox className="h-3 md:h-4 mt-1 text-[#00936c]" />
                                <p className="text-[14px] font-[500]">
                                  {airline.ticket_type}
                                </p>
                              </div>
                              <div className="flex gap-3 items-center space-y-1">
                                <TbCheckbox className="h-3 md:h-4 mt-1 text-[#00936c]" />
                                <p className="text-[14px] font-[500]">
                                  {airline.is_return_flight_included
                                    ? "Return Flight"
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {packageDetail.transport_detail &&
                      packageDetail.transport_detail.map((transport, index) => (
                        <div key={index}>
                          <div className="flex gap-1.5">
                            <p className="text-[18px] font-[700]">
                              {transport.transport_type
                                .split(",")
                                .map((part, idx) => (
                                  <div className="" key={idx}>
                                    <p className="text-[20px] font-[700]">
                                      {part.trim()}
                                    </p>
                                  </div>
                                ))}
                            </p>
                            <p className="text-[20px] font-[700]">
                              {transport.transport_name}
                            </p>
                          </div>
                          <div className="block gap-10">
                            <div className="flex flex-wrap gap-3">
                              {transport.routes.split(",").map((part, idx) => (
                                <div
                                  className="flex items-center gap-3"
                                  style={{ whiteSpace: "nowrap" }}
                                  key={idx}
                                >
                                  <TbCheckbox className="h-3 md:h-4 text-[#00936c]" />
                                  <p className="text-[14px] font-[500]">
                                    {part.trim()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                    <div>
                      <p className="text-[18px] font-[700]">
                        Mecca & Madinah Zyarah{" "}
                      </p>
                      {packageDetail.ziyarah_detail &&
                        packageDetail.ziyarah_detail.map((ziyarah, index) => (
                          <div
                            key={index}
                            className="md:flex gap-5 items-center"
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              {ziyarah.ziyarah_list.split(",").map(
                                (part, idx) =>
                                  part.trim() && (
                                    <div
                                      className="flex items-center gap-3"
                                      style={{ whiteSpace: "nowrap" }}
                                      key={idx}
                                    >
                                      <TbCheckbox className="h-3 md:h-4 text-[#00936c]" />
                                      <p className="text-[12px] md:text-[14px] font-[500]">
                                        {part.trim()}
                                      </p>
                                    </div>
                                  )
                              )}
                            </div>

                            {/* Add more MdCheckBox components as needed */}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-3 w-full ">
                <div className="w-full space-y-1.5">
                  <p className="text-[18px] font-[600]">
                    Additional Persons Cost:
                  </p>
                  <div className="space-y-2 md:space-y-0 md:flex gap-6 bg-[#F2F2F3] p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <TbCheckbox className={`h-3 md:h-4 text-[#00936c] `} />
                      <div className="flex items-center gap-3 text-[14px] font-[400] font-kd">
                        <p>Infants</p>
                        <p className="text-[#00936c]">
                          <NumericFormat
                            value={convertedCostForInfants}
                            displayType={"text"}
                            thousandSeparator
                            prefix={`${selectedCurrency} `}
                            decimalScale={2}
                            fixedDecimalScale={true}
                          />
                        </p>
                      </div>
                    </div>{" "}
                    <div className="flex items-center gap-3">
                      <TbCheckbox className={`h-3 md:h-4 text-[#00936c] `} />
                      <div className="flex items-center gap-3 text-[14px] font-[400] font-kd">
                        <p>Child</p>
                        <p className="text-[#00936c]">
                          <NumericFormat
                            value={convertedCostForChild}
                            displayType={"text"}
                            thousandSeparator
                            prefix={`${selectedCurrency} `}
                            decimalScale={2}
                            fixedDecimalScale={true}
                          />
                        </p>
                      </div>
                    </div>{" "}
                    <div className="flex items-center gap-3">
                      <TbCheckbox className={`h-3 md:h-4 text-[#00936c] `} />
                      <div className="flex items-center gap-3 text-[14px] font-[400] font-kd">
                        <p>Adult</p>
                        <p className="text-[#00936c]">
                          <NumericFormat
                            value={convertedCost}
                            displayType={"text"}
                            thousandSeparator
                            prefix={`${selectedCurrency} `}
                            decimalScale={2}
                            fixedDecimalScale={true}
                          />{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full space-y-1.5">
                  <p className="text-[18px] font-[600]">
                    Hotel Additional Cost:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xl:gap-6 rounded-md">
                    <div className="text-[14px] text-center font-[400] p-2 px-6 text-white rounded-sm bg-[#00936c] font-kd">
                      <p>Single room</p>
                      <NumericFormat
                        value={convertedCostForSingleRoom}
                        displayType={"text"}
                        thousandSeparator
                        prefix={`${selectedCurrency} `}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </div>
                    <div className="text-[14px] text-center font-[400] p-2 px-6 text-white rounded-sm bg-[#00936c] font-kd">
                      <p>Double Room</p>
                      <NumericFormat
                        value={convertedCostForDouble}
                        displayType={"text"}
                        thousandSeparator
                        prefix={`${selectedCurrency} `}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </div>

                    <div className="text-[14px] text-center font-[400] p-2 px-6 text-white rounded-sm bg-[#00936c] font-kd">
                      <p>Triple Room</p>
                      <NumericFormat
                        value={convertedCostForTriple}
                        displayType={"text"}
                        thousandSeparator
                        prefix={`${selectedCurrency} `}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </div>

                    <div className="text-[14px] text-center font-[400] p-2 px-6 text-white rounded-sm bg-[#00936c] font-kd">
                      <p>Quad Room</p>
                      <NumericFormat
                        value={convertedCostForQuad}
                        displayType={"text"}
                        thousandSeparator
                        prefix={`${selectedCurrency} `}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </div>

                    <div className="text-[14px] text-center font-[400] p-2 px-6 text-white rounded-sm bg-[#00936c] font-kd">
                      <p>Sharing Room</p>
                      <NumericFormat
                        value={convertedCostForSharing}
                        displayType={"text"}
                        thousandSeparator
                        prefix={`${selectedCurrency} `}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DetailPage;
