import { useState, useEffect } from "react";

const useUserLocation = () => {
  const [countryCode, setCountryCode] = useState("us");

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const locationResponse = await fetch(
          'https://api.ipgeolocation.io/ipgeo?apiKey=04a37adbe3614fe9be6af69373226aa0'
        );
        const locationData = await locationResponse.json();
        setCountryCode(locationData.country_code2.toLowerCase());
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchUserLocation();
  }, []);

  return countryCode;
};

export default useUserLocation;
