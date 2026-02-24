import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logoForLoggedIn.svg";
import { AppButton, AppContainer } from "../ui";

const Header = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const handleHelpClick = (event) => {
    event.preventDefault();
    window.open("https://hajjumrah.co/help-center", "_blank");
  };

  return (
    <header className="app-header-shell">
      <AppContainer className="flex w-full justify-between items-center py-4">
        <div className="flex items-center gap-x-4">
          <img src={logo} alt="Logo" className="lg:h-10 h-7" />
          <span className="hidden md:inline text-sm text-ink-500">Welcome to HajjUmrah.com</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://hajjumrah.co/help-center"
            onClick={handleHelpClick}
            className="text-sm text-ink-700 hover:text-brand-600"
          >
            Help
          </a>
          <AppButton onClick={handleSignOut} variant="ghost" className="text-sm px-4 py-2 min-h-0">
            Sign out
          </AppButton>
        </div>
      </AppContainer>
    </header>
  );
};

export default Header;
