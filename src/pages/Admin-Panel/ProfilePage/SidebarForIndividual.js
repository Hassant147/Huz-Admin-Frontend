import React, { useEffect, useState } from "react";
import "./styles.css"; // Import the CSS for the spinner
import phonecall from "../../../assets/phone-call.svg";
import profile from "../../../assets/profiledetail.svg";
import Loader from "../../../components/loader";

const SidebarForIndividual = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
    setUserProfile(profile);
  }, []);

  if (!userProfile) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader
          type="spinner-cub"
          bgColor="#00936c"
          color="#00936c"
          title="Loading"
          size={50}
        />
      </div>
    );
  }
  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden lg:w-[25%] p-6 mt-4 lg:mt-0">
      <span className="font-light text-xs text-[#4b465c] opacity-80">
        CONTACTS DETAILS
      </span>
      <div className="flex gap-2 items-center text-gray-700 mt-2">
        <img src={profile} alt="" className="h-5" />
        <span className="font-normal text-xs">Full Name: </span>
        <span className="font-thin text-xs ml-1">
          {userProfile.type_and_detail.contact_name || "Name Not Available"}
        </span>
      </div>
      <div className="flex gap-2 items-center text-gray-700 mt-2">
        <img src={phonecall} alt="" className="h-5" />
        <span className="font-normal text-xs">Contact: </span>
        <span className="font-thin text-xs ml-1">
          {userProfile.type_and_detail.contact_number ||
            "Contact Not Available"}
        </span>
      </div>
    </div>
  );
};

export default SidebarForIndividual;
