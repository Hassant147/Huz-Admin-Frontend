import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Headers/Header"; // Adjust the import path as necessary
import Banner from "./Navbar"; // Adjust the import path as necessary
import Footer from "./Footers/Footer";

const HeaderNavbarCom = ({ title, subtitle, children }) => {
  const location = useLocation(); // Hook to get the current route

  return (
    <div>
      <Navbar />
      {/* Conditionally render Banner if not on the login page */}
      {location.pathname !== "/" && (
        <Banner title={title} subtitle={subtitle} />
      )}
      <main>{children}</main>
      {location.pathname !== "/" && <Footer />}
    </div>
  );
};

export default HeaderNavbarCom;
