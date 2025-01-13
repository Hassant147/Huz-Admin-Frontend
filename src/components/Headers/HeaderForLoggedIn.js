import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logoForLoggedIn.svg';

const Header = () => {
    // Initialize navigate function from useNavigate hook
    const navigate = useNavigate();

    // Function to handle sign out
    const handleSignOut = () => {
        // Clear local storage
        localStorage.clear();
        // Redirect to home page
        navigate('/');
    };

    // Function to handle help link click
    const handleHelpClick = (e) => {
        e.preventDefault();
        window.open('https://hajjumrah.co/help-center', '_blank');
    };

    return (
        <header className="sticky top-0 z-50 flex w-full justify-between items-center py-4 lg:py-3 lg:px-10 px-7 bg-white shadow-custom-shadow1 font-sans">
            {/* Left section: Logo and text */}
            <div className="flex items-center gap-x-4">
                <img
                    src={logo}
                    alt="Logo"
                    className="lg:h-10 h-7"
                />
                <span className='text-sm text-gray-500 font-normal mt-2'>Welcome to HajjUmrah.com</span>
            </div>

            {/* Right section: Help and Sign out links */}
            <div className="flex items-center space-x-3">
                <a
                    href="https://hajjumrah.co/help-center"
                    onClick={handleHelpClick}
                    className="flex items-center space-x-1 text-gray-600 font-normal text-sm "
                >
                    <span className="hover:underline">Help</span>
                    <div className="bg-gray-200 rounded-full flex justify-center items-center p-4" style={{ width: '6px', height: '6px' }}>
                        ?
                    </div>
                </a>
                <button onClick={handleSignOut} className="text-[#00936C] font-medium text-sm hover:underline">
                    Sign out
                </button>
            </div>
        </header>
    );
};

export default Header;
