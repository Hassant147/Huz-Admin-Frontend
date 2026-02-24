import React from "react";
import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import booking from "../assets/booking.svg";
import dollarIcon from "../assets/coin.svg";
import dashboardIcon from "../assets/dashboardicon.png";
import complaintsIcon from "../assets/enroll.svg";
import packageIcon from "../assets/layout-sidebar.svg";
import starIcon from "../assets/star.svg";
import { AppContainer } from "./ui";

const NAV_ITEMS = [
  { to: "/partner-dashboard", label: "Dashboard", icon: dashboardIcon },
  { to: "/packages", label: "Package Management", icon: packageIcon },
  { to: "/booking", label: "Bookings", icon: booking },
  { to: "/wallet", label: "Wallet", icon: dollarIcon },
  { to: "/complaints", label: "Complaints", icon: complaintsIcon },
  { to: "/reviews-ratings", label: "Review & Ratings", icon: starIcon },
];

const navLinkClass = ({ isActive }) =>
  [
    "px-3 py-2 rounded-lg text-xs xl:text-sm flex items-center whitespace-nowrap transition-colors",
    isActive ? "bg-brand-100 text-brand-700" : "text-ink-700 hover:bg-slate-100",
  ].join(" ");

const NavigationBar = () => {
  return (
    <nav className="app-nav-shell">
      <AppContainer>
        <ul className="hidden lg:flex flex-wrap items-center gap-2 py-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={navLinkClass}>
                <img src={item.icon} alt={item.label} className="mr-2 size-[20px] xl:size-[22px]" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="lg:hidden text-xs py-2">
          <Swiper spaceBetween={8} slidesPerView={2.05} className="mySwiper">
            {NAV_ITEMS.map((item) => (
              <SwiperSlide key={item.to}>
                <NavLink to={item.to} className={navLinkClass}>
                  <img src={item.icon} alt={item.label} className="mr-2 size-[20px]" />
                  {item.label}
                </NavLink>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </AppContainer>
    </nav>
  );
};

export default NavigationBar;
