import React from 'react';
const Footer = () => {
    return (
        <footer className="py-4 bg-white shadow-custom-shadow1 font-sans">
            <div className="flex items-center justify-center space-x-1 lg:w-full w-[85%] mx-auto">
                <span className="text-[#484848] text-center font-thin text-sm">
                    By signing up you agree to the <span className="text-[#00936C]">Terms of Services</span> and <span className="text-[#00936C]">Privacy Policy</span>.
                </span>
            </div>
        </footer>
    );
};

export default Footer;
