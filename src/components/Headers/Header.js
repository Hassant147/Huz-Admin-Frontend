import React, { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import avatar1 from "../../assets/Avatar.svg";
import huzlogo from "../../assets/Components/huzlogo.svg";
import { useLocation } from "react-router-dom";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(["1", "2", "3"]); // This will hold the notifications

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const location = useLocation(); // Hook to get the current route

  const handleClickOutside = (event) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target) &&
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target)
    ) {
      setIsProfileOpen(false);
      setIsNotificationsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileOpen((prev) => !prev);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotificationsMenu = () => {
    setIsNotificationsOpen((prev) => !prev);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  return (
    <div className=" bg-white shadow-md font-kd">
      <header className="flex items-center justify-between py-4 w-[90%] mx-auto">
        {/* Logo */}
        <div className="flex items-end space-x-4">
          <a>
            <img src={huzlogo} alt="HajjUmrah" className="h-8" />
          </a>
        </div>

        {/* Conditional rendering: Hide these on the home page */}
        {location.pathname !== "/" && (
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <div className="relative">
                <FaBell
                  className="h-6 w-6 text-gray-600 cursor-pointer"
                  onClick={toggleNotificationsMenu}
                />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {notifications.length > 0 ? notifications.length : 0}
                </span>
              </div>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  ) : (
                    <ul className="py-2">
                      {notifications.map((notification, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {notification}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px bg-gray-300 h-6 mx-2"></div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <div className="relative">
                <img
                  src={avatar1}
                  alt="User Profile"
                  className="h-9 w-9 rounded-full"
                  onClick={toggleProfileMenu}
                />
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
              </div>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Settings
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
