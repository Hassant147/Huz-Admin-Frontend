import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white font-sans py-4">
      {/* Links Section */}
      <div className="w-[85%] mx-auto md:flex-row flex flex-col justify-between items-center">
        <nav className="flex space-x-6 text-gray-600 text-sm">
          <a
            href="/terms-of-services"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline md:flex gap-1"
          >
            Terms <span className="hidden md:block">of Services</span>
          </a>
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline md:flex gap-1"
          >
            <span className="hidden md:block">Privacy </span>Policy
          </a>
          <a
            href="/documentation"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Documentation
          </a>
          <a
            href="/faq"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            FAQs
          </a>
        </nav>

        {/* Copyright Section */}
        <div className="mt-4 md:mt-0 text-gray-500 text-sm">
          ©️ Copyright{" "}
          <span className="font-thin text-[#00936C]">Hajjumrah.co</span> 2024
        </div>
      </div>
    </footer>
  );
};

export default Footer;
