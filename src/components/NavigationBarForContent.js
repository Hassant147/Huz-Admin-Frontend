import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import arrow icons
import { NavLink } from "react-router-dom";
import "swiper/css"; // Ensure you import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import booking from "../assets/booking.svg";
import DollarIcon from "../assets/coin.svg";
import DashboardIcon from "../assets/dashboardicon.png";
import enroll from "../assets/enroll.svg";
import PackageIcon from "../assets/layout-sidebar.svg"; // Replace with the actual path to your SVG
import RefundIcon from "../assets/refund.svg";
import StarIcon from "../assets/star.svg";

const NavigationBar = () => {
  return (
    <nav className="sticky top-[60px] z-40 bg-white w-full text-gray-600 p-2 shadow-custom-box">
      {/* Desktop Navigation */}
      <ul className="hidden w-[90%] mx-auto lg:flex flex-wrap items-center font-thin text-sm ">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "px-3.5 py-[6px] lg:text-xs xl:text-sm rounded bg-[#E6F4F0] flex items-center"
                : "px-2.5 py-[10px] rounded lg:text-xs xl:text-sm flex items-center"
            }
          >
            <img
              src={DashboardIcon}
              alt="Dashboard"
              className=" mr-2 size-[20px] xl:size-[22px]"
            />
            Dashboard
          </NavLink>
        </li>
        <li className="relative group">
          <NavLink
            to={"/packages"}
            className={({ isActive }) =>
              isActive
                ? "px-3.5 py-[6px] lg:text-xs xl:text-sm rounded bg-[#E6F4F0] flex items-center"
                : "px-2.5 py-[10px] rounded lg:text-xs xl:text-sm flex items-center"
            }
          >
            <img
              src={PackageIcon}
              alt="Package Management"
              className="mr-2 size-[20px] xl:size-[22px]"
            />
            Package Management
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/booking"
            className={({ isActive }) =>
              isActive
                ? "px-3.5 py-[6px] lg:text-xs xl:text-sm rounded bg-[#E6F4F0] flex items-center"
                : "px-2.5 py-[10px] rounded lg:text-xs xl:text-sm flex items-center"
            }
          >
            <img
              src={booking}
              alt="Enrollment"
              className="mr-2 size-[20px] xl:size-[22px]"
            />
            Bookings
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/wallet"
            className={({ isActive }) =>
              isActive
                ? "px-3.5 py-[6px] lg:text-xs xl:text-sm rounded bg-[#E6F4F0] flex items-center"
                : "px-2.5 py-[10px] rounded lg:text-xs xl:text-sm flex items-center"
            }
          >
            <img
              src={DollarIcon}
              alt="Earnings"
              className="mr-2 size-[20px] xl:size-[22px]"
            />
            Wallet
          </NavLink>
        </li>{" "}
        <li>
          <NavLink
            to="/complaints"
            className={({ isActive }) =>
              isActive
                ? "px-3.5 py-[6px] lg:text-xs xl:text-sm rounded bg-[#E6F4F0] flex items-center"
                : "px-2.5 py-[10px] rounded lg:text-xs xl:text-sm flex items-center"
            }
          >
            <img
              src={enroll}
              alt="Complaints"
              className="mr-2 size-[20px] xl:size-[22px]"
            />
            Complaints
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/reviews-ratings"
            className={({ isActive }) =>
              isActive
                ? "px-3.5 py-[6px] lg:text-xs xl:text-sm rounded bg-[#E6F4F0] flex items-center"
                : "px-2.5 py-[10px] rounded lg:text-xs xl:text-sm flex items-center"
            }
          >
            <img
              src={StarIcon}
              alt="Review"
              className="mr-2 size-[20px] xl:size-[22px]"
            />
            Review & Ratings
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/apps"
            className={({ isActive }) =>
              isActive
                ? "px-3.5 py-[6px] lg:text-xs xl:text-sm rounded bg-[#E6F4F0] flex items-center"
                : "px-2.5 py-[10px] rounded lg:text-xs xl:text-sm flex items-center"
            }
          >
            <img
              src={RefundIcon}
              alt="Refund"
              className="mr-2 size-[20px] xl:size-[22px]"
            />
            Refund Request
          </NavLink>
        </li>{" "} */}
      </ul>

      {/* Mobile Navigation */}
      <div className="lg:hidden text-xs relative">
        <Swiper spaceBetween={5} slidesPerView={2} className="mySwiper">
          <SwiperSlide>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "px-3.5 py-[6px] lg:text-xs xl:text-sm rounded bg-[#E6F4F0] flex items-center"
                  : "px-2.5 py-[10px] rounded lg:text-xs xl:text-sm flex items-center"
              }
            >
              <img
                src={DashboardIcon}
                alt="Dashboard"
                className="-mt-[1px] mr-2 size-[22px]"
              />
              Dashboard
            </NavLink>
          </SwiperSlide>
          <SwiperSlide className="relative">
            <NavLink
              to={"/packages"}
              className={({ isActive }) =>
                isActive
                  ? "px-3.5 py-[6px] lg:text-xs xl:text-sm rounded bg-[#E6F4F0] flex items-center"
                  : "px-2.5 py-[10px] rounded lg:text-xs xl:text-sm flex items-center"
              }
            >
              {/* <button className="px-3 py-[10px] rounded flex items-center text-[15px]"> */}
              <img
                src={PackageIcon}
                alt="Package Management"
                className="mr-2 -mt-[1px] size-[22px]"
              />
              Package Management
              <span className="ml-1 transition-transform duration-300">
                <FaChevronDown className="group-hover:hidden " />
                <FaChevronUp className="hidden group-hover:block " />
              </span>
              {/* </button> */}
            </NavLink>
            <div className="absolute left-0 mt-1 bg-white shadow-lg rounded opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-300">
              <NavLink
                to="/packages"
                className={({ isActive }) =>
                  isActive ? "block px-5 py-2 bg-[#E6F4F0]" : "block px-5 py-2"
                }
              >
                My Packages
              </NavLink>
              <NavLink
                to="/package-type"
                className={({ isActive }) =>
                  isActive ? "block px-3 py-2 bg-[#E6F4F0]" : "block px-3 py-2"
                }
              >
                Create new Package
              </NavLink>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-[10px] rounded bg-[#E6F4F0] text-[15px] flex items-center"
                  : "px-3 py-[10px] rounded flex items-center text-[15px]"
              }
            >
              <img
                src={booking}
                alt="Enrollment"
                className="mr-2 size-[22px] -mt-[1px]"
              />
              Bookings
            </NavLink>
          </SwiperSlide>
          <SwiperSlide>
            <NavLink
              to="/wallet"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-[10px] rounded bg-[#E6F4F0] flex items-center text-[15px]"
                  : "px-3 py-[10px] rounded flex items-center text-[15px]"
              }
            >
              <img
                src={DollarIcon}
                alt="Earnings"
                className="mr-2 -mt-[1px] size-[22px]"
              />
              Wallet
            </NavLink>
          </SwiperSlide>
          <SwiperSlide>
            <NavLink
              to="/complaints"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-[10px] rounded bg-[#E6F4F0] flex items-center text-[15px]"
                  : "px-3 py-[10px] rounded flex items-center text-[15px]"
              }
            >
              <img src={enroll} alt="Complaints" className="mr-2 size-[22px]" />
              complaints
            </NavLink>
          </SwiperSlide>{" "}
          <SwiperSlide>
            <NavLink
              to="/reviews-ratings"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-[10px] rounded bg-[#E6F4F0] flex items-center text-[15px]"
                  : "px-3 py-[10px] rounded flex items-center text-[15px]"
              }
            >
              <img src={StarIcon} alt="Review" className="mr-2 size-[22px]" />
              Review & Ratings
            </NavLink>
          </SwiperSlide>{" "}
          <SwiperSlide>
            {/* <NavLink
              to="/apps"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-[10px] rounded bg-[#E6F4F0] flex items-center text-[15px]"
                  : "px-3 py-[10px] rounded flex items-center text-[15px]"
              }
            >
              <img
                src={RefundIcon}
                alt="Refund"
                className="mr-2 -mt-[1px] size-[22px]"
              />
              Refund Request
            </NavLink> */}
          </SwiperSlide>{" "}
        </Swiper>
      </div>
    </nav>
  );
};

export default NavigationBar;
