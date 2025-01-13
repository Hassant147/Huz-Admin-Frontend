import React from "react";
import Header from "../../../components/Headers/HeaderForAdminPanel";
import NavigationBar from "../../../components/NavigationBarForContent";
import Banner from "./components/Banner";
import Tabs from "./components/Tabs";
import Footer from "../../../components/Footers/FooterForLoggedIn";

const Bookings = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NavigationBar />
      <Banner />
      <div className="flex-grow pb-5 bg-[#f6f6f6]">
        <Tabs />
      </div>
      <Footer />
    </div>
  );
};

export default Bookings;
