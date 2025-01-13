import React, { useEffect, useState } from "react";
import { uploadCompanyLogo } from "../../../utility/Api";
import { toast, Toaster } from "react-hot-toast";
import "./styles.css"; // Import the CSS for the spinner
import phonecall from "../../../assets/phone-call.svg";
import website from "../../../assets/world.svg";
import profile from "../../../assets/profiledetail.svg";
import camera from "../../../assets/camera.svg";
import nullprofile from "../../../assets/nullsidebarprofile.svg";

const SidebarForCompany = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
    setUserProfile(profile);
  }, []);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append(
        "partner_session_token",
        userProfile.partner_session_token
      );
      formData.append("company_logo", file);

      setLoading(true); // Start loader

      uploadCompanyLogo(formData)
        .then((response) => {
          toast.success("Upload successful!", {
            position: "top-right",
            duration: 2000,
          });

          // Update the local storage with the new profile data
          localStorage.setItem(
            "SignedUp-User-Profile",
            JSON.stringify(response.data)
          );
          setUserProfile(response.data); // Set the new profile data from the response
          setLoading(false); // Stop loader
        })
        .catch((error) => {
          toast.error("Upload failed.", {
            position: "top-right",
            duration: 2000,
          });
          console.error(error);
          setLoading(false); // Stop loader
        });
    }
  };

  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const company_logo = userProfile.partner_type_and_detail.company_logo
    ? `${apiUrl}${userProfile.partner_type_and_detail.company_logo}`
    : nullprofile;

  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden lg:w-[25%] p-6 mt-4 lg:mt-0 flex flex-col">
      <div className="relative flex justify-center">
        <div className="relative">
          <div className="bg-gray-300 rounded-full h-32 w-32 flex items-center justify-center">
            {company_logo && (
              <img
                src={company_logo}
                alt="Profile"
                className="border-4 border-white shadow-md rounded-full"
                style={{ width: "120px", height: "120px" }}
              />
            )}
          </div>
          <div
            className="absolute bottom-3 right-2.5 bg-white rounded-full p-1 shadow-md cursor-pointer"
            style={{ transform: "translate(25%, 25%)" }}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {loading ? (
              <div className="loader"></div>
            ) : (
              <img src={camera} alt="Phone" className="size-[30px] " />
            )}
          </div>
        </div>
      </div>
      <div
        className="text-center mt-6"
        style={{ maxWidth: "100%", overflow: "hidden", whiteSpace: "normal" }}
      >
        <h2 className="text-xl font-normal text-[#00936C]">
          {userProfile.partner_type_and_detail.company_name ||
            "Company Name Not Available"}
        </h2>
        <p
          className="mt-4 text-gray-600 text-left text-xs font-thin"
          style={{
            width: "100%",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {userProfile.partner_type_and_detail.company_bio.substring(0, 180) ||
            "Company Bio Not Available"}{" "}
          ...
        </p>
      </div>
      <div className="mt-5">
        <span className="font-light text-xs text-[#4B465C] opacity-50">
          CONTACT DETAILS
        </span>
        <div className="flex items-center text-gray-700 mt-2">
          <img src={profile} alt="Phone" className="size-[18px] mr-1.5 " />
          <span className="font-normal text-xs">Full Name: </span>
          <span className="font-thin text-xs ml-1">
            {userProfile.partner_type_and_detail.contact_name || "Name Not Available"}
          </span>
        </div>
        <div className="flex items-center text-gray-700 mt-2">
          <img src={phonecall} alt="Phone" className="size-[18px] mr-1.5 " />
          <span className="font-normal text-xs">Contact: </span>
          <span className="font-thin text-xs ml-1">
            {userProfile.partner_type_and_detail.contact_number ||
              "Contact Not Available"}
          </span>
        </div>
        <div className="flex items-center text-gray-700 mt-2">
          <img src={website} alt="Phone" className="size-[18px] mr-1.5 " />
          <span className="font-normal text-xs">Website: </span>
          <span className="font-thin text-xs ml-1">
            {userProfile.partner_type_and_detail.company_website ||
              "Website Not Available"}
          </span>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default SidebarForCompany;
