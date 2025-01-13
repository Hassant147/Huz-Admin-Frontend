import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footers/FooterForLoggedIn";
import HeaderForSignup from "../../components/Headers/HeaderForLoggedIn";
import bgimg from "../../assets/bgImageForReviewPage.png";
import { checkUserExistence } from "../../utility/AuthApis";
import Loader from "../../components/loader";
const NotificationPage = () => {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const signedUpUserProfile = JSON.parse(
      localStorage.getItem("SignedUp-User-Profile")
    );

    if (signedUpUserProfile) {
      setFullName(signedUpUserProfile.name);
      setCompanyName(signedUpUserProfile.partner_type_and_detail.company_name);
      setCity(signedUpUserProfile.partner_type_and_detail.city || "");
      setCountry(signedUpUserProfile.partner_type_and_detail.country || "");
    }

    const checkUser = async () => {
      try {
        const email = signedUpUserProfile?.email;

        if (email) {
          const result = await checkUserExistence(email);
          localStorage.setItem("SignedUp-User-Profile", JSON.stringify(result));

          if (result.account_status === "Active") {
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error checking user existence:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  if (loading) {
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
          title=""
          size={30}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-between min-h-screen bg-gray-50 font-sans"
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "",
      }}
    >
      <HeaderForSignup />
      <main className="flex flex-1 items-center justify-left px-16">
        <div className="lg:w-[50%] p-8 bg-[#f4f5e4] shadow-custom-shadow rounded-lg">
          <h1 className="text-xl font-semibold text-gray-800">
            Dear {fullName},
          </h1>
          <p className="text-sm text-gray-600 mt-4">
            We are pleased to inform you that your company, "{companyName},"
            located in {city}, {country}, is currently under review. Our team is
            thoroughly assessing the details you have provided.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            The review process is a standard procedure, typically taking 3-4
            working days to ensure compliance with our guidelines and policies.
            We appreciate your patience during this period.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Should you have any questions or concerns in the meantime, please
            feel free to reach out to our support team. We are here to assist
            you.
          </p>
          <p className="text-sm text-gray-600 mt-4">Best regards,</p>
          <p className="text-sm text-[#00936C] font-medium">
            Huz Solutions Limited
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationPage;
