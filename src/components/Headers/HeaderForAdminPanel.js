import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReactFlagsSelect from 'react-flags-select';
import { UserContext } from '../../context/UserContext'; // Import UserContext
import avatar from '../../assets/nullprofile.svg';
import bell from '../../assets/bell.svg';
import logo from '../../assets/dashboard-header/logo.svg';
import name from '../../assets/dashboard-header/name.svg';
import help from '../../assets/help.svg';
import logout from '../../assets/logout2.svg';
import profile from '../../assets/user-check.svg';
import setting from '../../assets/settings.svg';
import faq from '../../assets/faq.svg';
import notification from '../../assets/notification.svg';
import avatar1 from '../../assets/Avatar1.svg';
import avatar2 from '../../assets/Avatar2.svg';
import './HeaderForAdminPanel.css';

const Header = () => {
  const { userData } = useContext(UserContext); // Use UserContext
  const [selected, setSelected] = useState('PK');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    // {
    //   id: 1,
    //   title: "Congratulation Lettie",
    //   description: "Won the monthly bestseller gold badge",
    //   isNew: true,
    //   time: "1h ago",
    //   iconColor: "bg-purple-500",
    //   iconLetter: "L",
    //   image: avatar,
    // },
    // {
    //   id: 2,
    //   title: "Charles Franklin",
    //   description: "Accepted your connection",
    //   isNew: true,
    //   time: "12h ago",
    //   iconColor: "bg-blue-600",
    //   iconLetter: "CF",
    //   image: avatar1,
    // },
    // {
    //   id: 3,
    //   title: "Bernard Lamb",
    //   description: "You have new message from Bernard Lamb",
    //   isNew: false,
    //   time: "Feb 18, 8:26 AM",
    //   iconColor: "bg-teal-500",
    //   iconLetter: "BL",
    //   icon: "x",
    //   image: avatar2,
    // },
    // {
    //   id: 4,
    //   title: "Estella Christensen",
    //   description: "July monthly financial report is generated",
    //   isNew: false,
    //   time: "Apr 24, 10:30 AM",
    //   iconColor: "bg-purple-500",
    //   iconLetter: "EC",
    //   icon: "check",
    //   image: avatar2,
    // },
  ]);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef, notificationRef]);

  const unreadCount = notifications.filter((n) => n.isNew).length;

  const handleSignOut = () => {
    localStorage.removeItem("SignedUp-User-Profile");
    navigate('/');
  };

  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const profileImageUrl = userData.user_photo ? `${apiUrl}${userData.user_photo}` : avatar;

  return (
    <header className="sticky top-0 z-50 flex w-full justify-between items-center py-4 border-b-2 lg:py-3 lg:px-20 px-7 bg-white font-sans">
      {/* Left section: Logo and text */}
      <div className="flex items-center gap-x-1 sm:gap-x-2">
        <img src={logo} alt="Logo" className="h-5 sm:h-7 lg:h-9" />
        <img src={name} alt="Name" className="h-4 sm:h-6 lg:h-6 mt-2 sm:mt-3" />
        <span className="text-[#00936C] mt-2 rounded-md font-semibold font-k2d bg-[#f2f2f2] px-2.5 border-[1px] border-[#00936C] p-0.5 text-[12px] sm:text-xs">Business</span>
      </div>

      {/* Right section: Help and Sign out links */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="flex items-center gap-2 sm:space-x-1">
          <ReactFlagsSelect
            selected={selected}
            countries={['US', 'PK', 'GB', 'FR', 'DE']}
            showSelectedLabel={false}
            showOptionLabel={false}
            onSelect={(code) => setSelected(code)}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            className="text-xl top-1 hidden md:block custom-flag-select ReactFlagsSelect-module_selectBtn__19wW7:after"
            // gave this custom styling to remove the arrow in the dropdown menu
          />
          <button onClick={toggleNotifications} className="relative">
            <img src={bell} alt="Bell" className="size-[26px]" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          {isNotificationsOpen && (
            <div ref={notificationRef} className="absolute md:right-[130px] right-[15px] mt-[150px] border-[1px] md:w-[340px] z-50 bg-white border-gray-200 rounded-lg shadow-lg">
              <div className="flex justify-between items-center p-4">
                <h1 className="text-[#4B465C] font-semibold text-[18px]">Notifications</h1>
                {/* <img
                  src={notification}
                  alt="notification"
                  className="size-[24px]"
                /> */}
              </div>
              {/* {notifications.map((notification) => (
                <div key={notification.id}>
                  <hr className="border border-gray-200" />
                  <div
                    className={`flex items-center px-4 py-3 ${
                      notification.isNew ? "" : "hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 h-8 w-8 rounded-full ${notification.iconColor} flex items-center justify-center`}
                    >
                      {notification.icon ? (
                        <i
                          className={`fa fa-${notification.icon}`}
                          aria-hidden="true"
                        ></i>
                      ) : (
                        <img
                          src={notification.image}
                          alt="Avatar"
                          className="h-8 w-8 rounded-full"
                        />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-semibold">{notification.title}</p>
                      <p className="text-sm text-[#4B465C] opacity-80">
                        {notification.description}
                        There is no notification Yet
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))} */}
              <p className="text-sm text-[#4B465C] text-center pt-0 opacity-80 p-4">There is no notification Yet</p>
              {/* <div className="text-center text-blue-600 hover:bg-gray-100 p-2 cursor-pointer">
                View all notifications
              </div> */}
            </div>
          )}
          <hr className="border border-gray-300 w-[1px] h-[20px]" />
          <button onClick={toggleDropdown} className="relative">
            <img src={profileImageUrl} alt="Avatar" className="size-[38px] rounded-full" />
            <div className="h-3 w-3 rounded-full absolute top-[25px] left-[25px] bg-[#00936C]" />
            {isDropdownOpen && (
              <div ref={dropdownRef} className="absolute right-0 w-60 mt-2 bg-white border pb-2.5 border-gray-200  rounded-md shadow-lg z-50">
                <div className="flex items-center px-4 py-3 gap-2">
                  <div className="flex items-center">
                    <img src={profileImageUrl} alt="Avatar" className="size-[38px] rounded-full" />
                    <div className="h-3 w-3 rounded-full absolute left-11 top-10 bg-[#00936C]" />
                  </div>
                  <div className="block">
                    <h1 className="text-[#4B465C] font-semibold text-[15px]">{userData.user_name}</h1>
                    <div className="text-sm text-gray-500 text-left">Admin</div>
                  </div>
                </div>
                <hr className="border border-gray-200" />
                <Link to="/profile" className="flex items-center px-4 py-3 hover:bg-gray-100 ">
                  <img src={profile} alt="Profile" className="mr-3 size-[18px]" />
                  <p className="text-sm">My Profile</p>
                </Link>
                <hr className="border border-gray-200" />
                <Link to="/help" className="flex items-center px-4 py-3 hover:bg-gray-100">
                  <img src={help} alt="Help" className="mr-3 size-[18px]" /> <p className="text-sm">Help</p>
                </Link>
                <Link to="/faq" className="flex items-center px-4 py-3 hover:bg-gray-100">
                  <img src={faq} alt="FAQ" className="mr-3 size-[18px]" />
                  <p className="text-sm"> FAQ</p>
                </Link>
                <hr className="border border-gray-200" />
                <button onClick={handleSignOut} className="flex items-center px-4 py-3 hover:bg-gray-100 w-full text-left">
                  <img src={logout} alt="Sign Out" className="mr-3 size-[18px]" /> <p className="text-sm">Sign Out</p>
                </button>
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
