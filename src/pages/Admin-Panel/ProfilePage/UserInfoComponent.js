import React, { useEffect, useState, useContext } from "react";
import bg from "../../../assets/ProfileManagement/UserInfoBg.svg";
import { uploadProfileImage } from "../../../utility/Api";
import { toast, Toaster } from "react-hot-toast";
import "./styles.css";
import nullprofile from "../../../assets/nullprofile.svg";
import camera from "../../../assets/camera.svg";
import email from "../../../assets/email.svg";
import phone from "../../../assets/phone-call.svg";
import { UserContext } from "../../../context/UserContext"; // Import UserContext

const UserInfoComponent = () => {
  const { userData, updateUserProfile } = useContext(UserContext); // Use UserContext
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { partner_session_token } = JSON.parse(
    localStorage.getItem("SignedUp-User-Profile")
  );

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const formData = new FormData();
      formData.append("partner_session_token", partner_session_token);
      formData.append("user_photo", file);

      setLoading(true);

      uploadProfileImage(formData)
        .then((response) => {
          toast.success("Upload successful!", {
            position: "top-right",
            duration: 2000,
          });

          const updatedProfile = {
            ...userData,
            user_photo: response.data.user_photo,
          };

          updateUserProfile(updatedProfile);
          setLoading(false);
        })
        .catch((error) => {
          toast.error("Upload failed.", {
            position: "top-right",
            duration: 2000,
          });
          console.error(error);
          setLoading(false);
        });
    }
  };

  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const profileImageUrl = userData.user_photo
    ? `${apiUrl}${userData.user_photo}`
    : nullprofile;

  const handleButtonClicked = () => {
    const url = `${apiUrl}/profile/${userData.user_name}`;
    window.open(url, "_blank");
  };
  return (
    <div className="shadow-md overflow-hidden">
      {/* Top div with background image */}
      <div
        className="relative bg-cover bg-center py-16"
        style={{ backgroundImage: `url(${bg})`, height: "" }}
      >
        <div className="absolute inset-0 bg-[#00936C] opacity-30"></div>
      </div>

      {/* Bottom div with white background */}
      <div className="bg-white py-4">
        <div className="relative flex flex-col md:flex-row items-center lg:w-[85%] mx-auto">
          <div className="relative -mt-16">
            {profileImageUrl && (
              <img
                src={profileImageUrl}
                alt="Profile1"
                className="border-4 border-white shadow-md rounded-md"
                style={{ width: "130px", height: "130px" }}
              />
            )}
            <div
              className="absolute top-0 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer"
              style={{ transform: "translate(20px, -10px)" }}
            >
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <img
                src={camera}
                alt="Phone"
                className="size-[30px]"
              />
              {loading ? <div className="loader"></div> : ""}
            </div>
          </div>
          <div className="mt-4 md:mt-0 ml-0 md:ml-4 flex-grow space-y-1.5 text-center md:text-left">
            <h2 className="text-2xl text-[#4b465c] font-normal">
              {userData.name || "No Name"}
            </h2>
            <div className="font-light text-sm flex flex-col md:flex-row md:space-x-4 text-gray-600">
              <div className="flex items-center gap-1 text-sm">
                <img src={email} alt="" className="size-[18px]" />{" "}
                {userData.email}
              </div>
              <p className="flex items-center gap-1 text-sm">
                <img src={phone} alt="" className="size-[18px]" />
                {userData.country_code} {userData.phone_number}
              </p>
            </div>
          </div>
          {userData.partner_type === "Individual" ? (
            ""
          ) : (
            <button
              className="mt-4 text-xs md:mt-0 bg-[#00936C] text-white py-2 px-3 rounded-lg shadow-md"
              onClick={handleButtonClicked}
            >
              Visit your website
            </button>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default UserInfoComponent;
