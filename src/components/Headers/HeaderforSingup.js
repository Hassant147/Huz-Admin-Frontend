import React from "react";
import logo from "../../assets/logoForHeader.png";
import { AppContainer } from "../ui";

const Header = () => {
  return (
    <header className="app-header-shell">
      <AppContainer className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="lg:h-10 h-7" />
        </div>

        <div className="flex items-center space-x-1 text-sm">
          <span className="text-ink-500">Already have an account?</span>
          <a href="/" className="text-brand-600 font-semibold hover:underline">
            Sign in
          </a>
        </div>
      </AppContainer>
    </header>
  );
};

export default Header;
