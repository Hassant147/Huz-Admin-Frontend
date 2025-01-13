import React, { useState, useEffect } from "react";
import { enrollPackageZiyarahDetail } from "../../../../utility/Api"; // Import the API function
import ClipLoader from "../../../../components/loader";
import { BiErrorAlt } from "react-icons/bi";

const ZiyarahForm = ({ formData, onChange, onNextTab }) => {
  const [ziyarahDetails, setZiyarahDetails] = useState({
    includedSites: formData?.includedSites || {
      Makkah: [],
      Madinah: [],
    },
  });

  const [errors, setErrors] = useState({
    Makkah: "",
    Madinah: "",
  });

  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // Site options hardcoded for demonstration purposes
  const ziyarahOptions = {
    Makkah: [
      "Home of HAZRAT MUHAMMAD صلى الله عليه وسلم",
      "Ghar-E-Soor",
      "Taif",
      "Masjid al-Haram",
      "The Holy Kaaba",
      "Maqam Ibrahim ",
      "Hajar al-Aswad ",
      " Well of Zamzam ",
      "Jabal al-Nour (Mount of Light)",
      "Cave of Hira ",
      " Jannat al-Mualla ",
      " Masjid Aisha ",
      "Masjid al-Jinn ",
      " Masjid al-Khayf ",
      " Mina ",
      "Arafat ",
      "  Muzdalifah",
    ],
    Madinah: [
      "Masjid Ali Nabwi",
      "Jannat Al-Baqi",
      "Quba Mosque",
      "Uhud Mountain",
      "Masjid Al-Qiblatain",
      "The Baab-As-Salaam",
      "Mosque Al Ghamamah",
      "Battlefield Of The Trench (Khandaq)",
    ],
  };

  useEffect(() => {
    localStorage.setItem("ziyarahDetails", JSON.stringify(ziyarahDetails));
  }, [ziyarahDetails]);

  // const validateSites = (city, sites) => {
  //   if (sites.length === 0) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       [city]: `At least one site in ${city} must be selected`,
  //     }));
  //     return false;
  //   } else {
  //     setErrors((prev) => ({ ...prev, [city]: "" }));
  //     return true;
  //   }
  // };

  const handleSiteToggle = (city, site) => {
    setZiyarahDetails((prev) => {
      const updatedSites = prev.includedSites[city].includes(site)
        ? prev.includedSites[city].filter((s) => s !== site)
        : [...prev.includedSites[city], site];

      const newDetails = {
        ...prev,
        includedSites: {
          ...prev.includedSites,
          [city]: updatedSites,
        },
      };

      // validateSites(city, updatedSites);
      onChange(newDetails);

      return newDetails;
    });
  };

  const handleContinue = async () => {
    // const makkahValid = validateSites(
    //   "Makkah",
    //   ziyarahDetails.includedSites.Makkah
    // );
    // const madinahValid = validateSites(
    //   "Madinah",
    //   ziyarahDetails.includedSites.Madinah
    // );

    // if (makkahValid && madinahValid) {
    const { partner_session_token } = JSON.parse(
      localStorage.getItem("SignedUp-User-Profile")
    );
    const huzToken = localStorage.getItem("huz_token");
    const apiData = {
      partner_session_token,
      huz_token: huzToken,
      ziyarah_list: [
        ...ziyarahDetails.includedSites.Makkah,
        ...ziyarahDetails.includedSites.Madinah,
      ].join(", "),
    };

    setLoading(true);
    setApiError("");

    try {
      await enrollPackageZiyarahDetail(apiData);
      onNextTab();
    } catch (error) {
      setApiError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
    // }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 font-sans text-xs lg:text-sm">
      <div className="space-y-6 lg:w-3/4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h1 className="text-sm lg:text-base text-gray-600 mb-4">
            Included Ziyarah
          </h1>
          {Object.entries(ziyarahOptions).map(([city, sites]) => (
            <div key={city} className="mb-6">
              <h3 className="text-xs lg:text-sm font-normal text-gray-700 mb-2">
                {city}
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
                {sites.map((site) => (
                  <div
                    key={site}
                    className="flex items-center font-thin text-[10px] lg:text-sm text-gray-500"
                  >
                    <input
                      type="checkbox"
                      id={`${city}-${site}`}
                      checked={ziyarahDetails.includedSites[city].includes(
                        site
                      )}
                      onChange={() => handleSiteToggle(city, site)}
                      className="mr-2"
                      style={{ accentColor: "#00936C" }}
                    />
                    <label htmlFor={`${city}-${site}`}>{site}</label>
                  </div>
                ))}
              </div>
              {errors[city] && (
                <div
                  className="text-red-500 text-xs flex items-center
       gap-1 mt-1"
                >
                  <BiErrorAlt />{" "}
                  <p className="text-red-500 text-xs">{errors[city]}</p>
                </div>
              )}
            </div>
          ))}
          {apiError && (
            <div
              className="text-red-500 text-xs flex items-center
       gap-1 mt-1"
            >
              <BiErrorAlt /> <p className="text-red-500 text-xs">{apiError}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleContinue}
          disabled={loading}
          className={`mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs lg:text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full ${
            loading && "cursor-not-allowed"
          }`}
        >
          <span className="flex items-center">
            <span className="mr-1">Continue</span>
            {loading && <ClipLoader size={14} color={"#fff"} />}
          </span>
        </button>
      </div>
      <div className="mt-4 lg:mt-0 lg:w-[25%] h-1/4 p-4 bg-[#E6F4F0] rounded-lg border border-green-200 shadow-sm">
        <p className="text-xs lg:text-sm text-gray-600">
          Please ensure that the information you provide is accurate and
          carefully considered. Accurate information helps in providing the best
          possible services.
        </p>
      </div>
    </div>
  );
};

export default ZiyarahForm;
