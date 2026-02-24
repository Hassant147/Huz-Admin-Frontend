import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactFlagsSelect from "react-flags-select";
import { UserContext } from "../../context/UserContext";
import avatar from "../../assets/nullprofile.svg";
import bell from "../../assets/bell.svg";
import logo from "../../assets/dashboard-header/logo.svg";
import name from "../../assets/dashboard-header/name.svg";
import logout from "../../assets/logout2.svg";
import profile from "../../assets/user-check.svg";
import faq from "../../assets/faq.svg";
import { AppButton, AppContainer } from "../ui";
import "./HeaderForAdminPanel.css";

const Header = () => {
  const { userData } = useContext(UserContext);
  const [selectedCountry, setSelectedCountry] = useState("PK");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = useMemo(() => [], []);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const unreadCount = notifications.filter((notification) => notification.isNew).length;
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const profileImageUrl = userData?.user_photo ? `${apiUrl}${userData.user_photo}` : avatar;

  return (
    <header className="app-header-shell">
      <AppContainer className="flex w-full justify-between items-center py-4 gap-4">
        <div className="flex items-center gap-x-2">
          <img src={logo} alt="Logo" className="h-6 sm:h-8" />
          <img src={name} alt="Name" className="h-4 sm:h-6 mt-2" />
          <span className="app-status-pill hidden sm:inline-flex">Business</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ReactFlagsSelect
            selected={selectedCountry}
            countries={["US", "PK", "GB", "FR", "DE"]}
            showSelectedLabel={false}
            showOptionLabel={false}
            onSelect={(code) => setSelectedCountry(code)}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            className="hidden md:block"
          />

          <div className="relative" ref={notificationRef}>
            <button type="button" onClick={() => setIsNotificationsOpen((prev) => !prev)} className="relative">
              <img src={bell} alt="Notifications" className="size-[26px]" />
              {unreadCount > 0 ? (
                <span className="absolute top-0 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              ) : null}
            </button>

            {isNotificationsOpen ? (
              <div className="absolute right-0 mt-3 w-[320px] max-w-[90vw] app-panel z-50">
                <div className="p-4 border-b border-slate-200">
                  <h1 className="text-ink-900 font-semibold text-base">Notifications</h1>
                </div>
                <p className="text-sm text-ink-500 text-center p-4">There are no notifications yet.</p>
              </div>
            ) : null}
          </div>

          <div className="h-6 w-px bg-slate-300" />

          <div className="relative" ref={dropdownRef}>
            <button type="button" onClick={() => setIsDropdownOpen((prev) => !prev)} className="relative">
              <img src={profileImageUrl} alt="Avatar" className="size-[38px] rounded-full object-cover" />
              <div className="h-3 w-3 rounded-full absolute top-[25px] left-[25px] bg-brand-500 border border-white" />
            </button>

            {isDropdownOpen ? (
              <div className="absolute right-0 w-64 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
                <div className="flex items-center px-4 py-3 gap-3">
                  <img src={profileImageUrl} alt="Avatar" className="size-[38px] rounded-full object-cover" />
                  <div>
                    <h1 className="text-ink-900 font-semibold text-sm">{userData?.user_name || "Admin"}</h1>
                    <div className="text-xs text-ink-500">Admin</div>
                  </div>
                </div>
                <div className="border-t border-slate-200" />
                <Link to="/profile" className="flex items-center px-4 py-3 hover:bg-slate-50 text-sm text-ink-700">
                  <img src={profile} alt="Profile" className="mr-3 size-[18px]" />
                  My Profile
                </Link>
                <Link to="/faq" className="flex items-center px-4 py-3 hover:bg-slate-50 text-sm text-ink-700">
                  <img src={faq} alt="FAQ" className="mr-3 size-[18px]" />
                  FAQ
                </Link>
                <div className="border-t border-slate-200" />
                <div className="px-4 py-3">
                  <AppButton onClick={handleSignOut} variant="secondary" className="w-full flex items-center justify-center gap-2">
                    <img src={logout} alt="Sign Out" className="size-[14px]" />
                    Sign Out
                  </AppButton>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </AppContainer>
    </header>
  );
};

export default Header;
