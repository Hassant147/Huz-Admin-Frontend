import React from 'react';
import logo from '../../assets/logoForHeader.png'
const Header = () => {
    return (
        <header className="flex justify-between items-center py-4 lg:py-3 lg:px-10 px-7 bg-white shadow-custom-shadow1 font-sans">
            {/* Left section: Logo and text */}
            <div className="flex items-center space-x-2">
                <img
                    src={logo}
                    alt="Logo"
                    className="lg:h-10 h-7"
                />
            </div>

            {/* Right section: Sign in link */}
            <div className="flex items-center space-x-1">
                <span className="text-[#484848] font-thin text-sm">Dont have an account?</span>
                <a href="/" className="text-[#00936C] font-medium text-sm hover:underline">
                    Sign Up
                </a>
            </div>
        </header>
    );
};

export default Header;
