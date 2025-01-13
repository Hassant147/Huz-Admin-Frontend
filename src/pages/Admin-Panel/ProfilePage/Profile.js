import React, { useState, useEffect } from "react";

import NavigationBar from "../../../components/NavigationBarForContent";
import Header from "../../../components/Headers/HeaderForAdminPanel";
import Footer from "../../../components/Footers/FooterForLoggedIn";
import UserInfoComponent from "./UserInfoComponent";
import SidebarForCompany from "./SidebarForCompany";
import SidebarForIndividual from "./SidebarForIndividual";
import NavTabs from "./NavTabs";

import CompanyDetail from "./CompanyDetail";
import IndividualDetail from "./IndividualDetail"; // Assume this component exists
import AddressDetail from "./AddressDetail";
import ChangePassword from "./ChangePassword";

import Loader from "react-js-loader";
const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("company");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const profileData = JSON.parse(
      localStorage.getItem("SignedUp-User-Profile")
    );
    setProfile(profileData);
  }, []);

  const renderSidebar = () => {
    if (profile) {
      return profile.partner_type === "Individual" ? (
        <SidebarForIndividual />
      ) : (
        <SidebarForCompany className="h-20" />
      );
    }
    return null;
  };

  const renderTabContent = () => {
    if (!profile) return null;

    switch (selectedTab) {
      case "company":
        return profile.partner_type === "Individual" ? (
          <IndividualDetail />
        ) : (
          <CompanyDetail />
        );
      case "address":
        return <AddressDetail />;
      case "password":
        return <ChangePassword />;
      default:
        return profile.partner_type === "Individual" ? (
          <IndividualDetail />
        ) : (
          <CompanyDetail />
        );
    }
  };

  if (!profile) {
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
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <NavigationBar />
      <UserInfoComponent />
      <main className="w-[85%] mx-auto py-6">
        <div className="mb-8">
          <NavTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </div>
        <div className="lg:flex lg:space-y-0 space-y-4 lg:space-x-4 items-start">
          {renderSidebar()}
          {renderTabContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
