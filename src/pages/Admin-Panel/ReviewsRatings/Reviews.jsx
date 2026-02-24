import React, { useEffect, useState } from "react";
import bannerimg from "../../../assets/bookingbg.svg";
import arrow from "../../../assets/arrow.svg";
import RatingSystem from "./RatingSystem";
import ReviewComponent from "./ReviewComponent";
import AdminPanelLayout from "../../../components/layout/AdminPanelLayout";
import {
  getOverPartnerComments,
  getOverPartnerRating,
  getOverPartnerTotalRating,
  getPartnerAllPackagesByToken,
} from "../../../utility/Api";
import Loader from "../../../components/loader";

const Reviews = () => {
  const [packages, setPackages] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [isType, setIsType] = useState("Hajj");
  const [selectedPackageToken, setSelectedPackageToken] = useState(null);
  const [selectedTotalPackageToken, setSelectedTotalPackageToken] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [totalRatings, setTotalRatings] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [defaultPackageSet, setDefaultPackageSet] = useState(false);

  const handlePackageTypeClick = (type) => {
    setIsType(type);
    setDefaultPackageSet(false);
    setIsLoading(true);
    setPackages([]);
    setReviews([]);
    setTotalRatings([]);
    setTotalReviews(0);
  };

  const handlePackageClick = async (pkg) => {
    setSelectedPackageToken(pkg.huz_token);
    fetchReviewData(pkg.huz_token);
    setReviews([]);
    setApiError(null);
  };

  const handlePackageClickForTotalRating = async (pkg) => {
    setSelectedTotalPackageToken(pkg.huz_token);
    fetchTotalReviewData(pkg.huz_token);
  };

  const fetchReviewData = async (huz_token) => {
    const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
    if (profile) {
      try {
        const result = await getOverPartnerComments(profile.partner_session_token, huz_token);
        if (result.message === "No ratings found for this package.") {
          setReviews([]);
        } else {
          setReviews(result);
        }
      } catch (error) {
        setApiError(error.message || "Error fetching comments");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchTotalReviewData = async (huz_token) => {
    const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
    if (profile) {
      try {
        const result = await getOverPartnerTotalRating(profile.partner_session_token, huz_token);
        if (result.error) {
          setApiError(result.error.message || "Error fetching total ratings");
        } else {
          setTotalRatings([
            { stars: 5, count: result.total_package_star_5 },
            { stars: 4, count: result.total_package_star_4 },
            { stars: 3, count: result.total_package_star_3 },
            { stars: 2, count: result.total_package_star_2 },
            { stars: 1, count: result.total_package_star_1 },
          ]);
          setTotalReviews(
            result.total_package_star_5 +
            result.total_package_star_4 +
            result.total_package_star_3 +
            result.total_package_star_2 +
            result.total_package_star_1
          );
        }
      } catch (error) {
        setApiError(error.message || "Error fetching total ratings");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchPackageData = async () => {
      const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
      if (profile) {
        try {
          const result = await getPartnerAllPackagesByToken(profile.partner_session_token, isType);
          if (result.error) {
            setApiError(result.error.message || "Error fetching packages");
            setPackages([]);
          } else {
            setPackages(result.results);
            if (!defaultPackageSet && result.results.length > 0) {
              handlePackageClick(result.results[0]);
              handlePackageClickForTotalRating(result.results[0]);
              setDefaultPackageSet(true);
            } else if (result.results.length === 0) {
              setReviews([]);
              setTotalRatings([]);
              setTotalReviews(0);
            }
          }
        } catch (error) {
          setApiError(error.message || "Error fetching packages");
          setPackages([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPackageData();
  }, [isType]);

  useEffect(() => {
    const fetchRatingData = async () => {
      const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
      if (profile) {
        try {
          const result = await getOverPartnerRating(profile.partner_session_token);
          if (result.error) {
            setApiError(result.error.message || "Error fetching ratings");
          } else {
            setRatings([
              { stars: 5, count: result.total_star_5 },
              { stars: 4, count: result.total_star_4 },
              { stars: 3, count: result.total_star_3 },
              { stars: 2, count: result.total_star_2 },
              { stars: 1, count: result.total_star_1 },
            ]);
          }
        } catch (error) {
          setApiError("Error fetching ratings");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRatingData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate} ${formattedTime.toLowerCase()}`;
  };

  return (
    <AdminPanelLayout useContainer={false} mainClassName="bg-[#f6f6f6] py-0">
      <div
        className="bg-[#bcdfd7]"
        style={{
          backgroundImage: `url(${bannerimg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-[90%] h-[100px] mx-auto flex items-center">
          <div className="flex items-center relative gap-2">
            <h1 className="font-k2d md-12 font-medium text-lg text-[#4B465C] opacity-80">
              All packages overall Ratings{" "}
            </h1>
            <div>
              {Array.isArray(ratings) ? (
                <div className="text-[#4B465C] font-k2d font-bold text-[20px] opacity-">
                  <p>
                    {ratings.reduce((total, rating) => total + rating.count, 0)}
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-[90%] -mt-6 mx-auto justify-between items-center bg-white p-4 shadow-custom-box h-[104px] rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center w-full md:px-14 relative">
            <Loader />
          </div>
        ) : Array.isArray(ratings) ? (
          ratings.map((rating, index) => (
            <div
              key={index}
              className="md:flex w-[20%] items-center md:px-14 relative"
            >
              <div className="flex flex-col w-[100%] item-center justify-center text-center">
                <div className="font-semibold text-[20px] opacity-80 text-[#00936C]">
                  {rating.count.toLocaleString("en-US")}
                </div>
                <div className="text-[#4B465C] font-semibold text-[14px] opacity-80">
                  ({rating.stars} Stars)
                </div>
                {index !== ratings.length - 1 && (
                  <div className="absolute right-[-7px] top-[10%] h-[47px] w-[5px] rounded-xl bg-[#EDEDED]" />
                )}
              </div>
            </div>
          ))
        ) : (
          ""
        )}
      </div>

      <div className="md:flex w-[90%] space-y-4 md:space-y-0 mt-3 mx-auto rounded-lg mb-4">
        <div className="flex flex-col md:w-1/3 md:mr-3 mx-auto bg-white shadow-custom-box rounded-lg ">
          <h1 className="items-left p-6 text-[#4B465C] font-medium text-sm">
            Check Rating Package wise
          </h1>
          <div className="px-6 flex items-center justify-center gap-2 mb-2">
            <button
              className={`bg-gray-100 p-2 px-6 rounded-md text-sm ${isType === "Hajj" ? "bg-green-200" : ""}`}
              onClick={() => handlePackageTypeClick("Hajj")}
            >
              Hajj
            </button>
            <button
              className={`bg-gray-100 p-2 px-6 rounded-md text-sm ${isType === "Umrah" ? "bg-green-200" : ""}`}
              onClick={() => handlePackageTypeClick("Umrah")}
            >
              Umrah
            </button>
          </div>
          {isLoading ? (
            <div className="h-[400px] flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <div className="h-[400px] overflow-y-auto">
              {Array.isArray(packages) && packages.length > 0 ? (
                packages.map((pkg, index) =>
                  pkg.package_status === "Active" ? (
                    <div
                      key={index}
                      onClick={() => {
                        handlePackageClick(pkg);
                        handlePackageClickForTotalRating(pkg);
                      }}
                      className={`cursor-pointer ${selectedPackageToken === pkg.huz_token ? 'bg-[#cce9e2]' : 'bg-[#f6f6f6]'}`}
                    >
                      <div className="px-6 mb-1 flex justify-between hover:bg-gray-200 items-center">
                        <div>
                          <div className="space-y-1.5">
                            <h2 className="text-sm font-semibold text-[#00936C]">
                              {pkg.package_name}
                            </h2>
                            <p className="text-[#4B465C] font-medium text-xs opacity-80">
                              {pkg.package_cost}
                            </p>
                            <p className="text-[#4B465C] font-normal text-xs opacity-80">
                              {formatDate(pkg.start_date)}
                            </p>
                          </div>
                        </div>
                        <img src={arrow} alt="" className="py-8 " />
                      </div>
                    </div>
                  ) : (
                    ""
                  )
                )
              ) : (
                <div className="h-[400px] flex justify-center items-center">
                  <p className="text-[#4B465C] font-medium text-sm">No packages available for {isType}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:w-[70%] mb-10 mx-auto justify-between items-center h-auto">
          <div className="block">
            <div className="w-full items-start">
              <RatingSystem
                totalRatings={totalRatings}
                totalReviews={totalReviews}
              />
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center my-10">
                <Loader />
              </div>
            ) : (
              <div className="w-full mt-5">
                <ReviewComponent reviews={reviews} apiError={apiError} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminPanelLayout>
  );
};

export default Reviews;
