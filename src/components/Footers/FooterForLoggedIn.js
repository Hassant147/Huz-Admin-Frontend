import React from "react";
import { AppContainer } from "../ui";

const Footer = () => {
  return (
    <footer className="app-footer-shell py-4 mt-6">
      <AppContainer className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-ink-500">
        <nav className="flex flex-wrap items-center justify-center gap-4">
          <a href="/terms-of-services" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">
            Terms of Services
          </a>
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">
            Privacy Policy
          </a>
          <a href="/documentation" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">
            Documentation
          </a>
          <a href="/faq" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">
            FAQs
          </a>
        </nav>
        <div>
          © Copyright <span className="font-semibold text-brand-600">Hajjumrah.co</span> 2026
        </div>
      </AppContainer>
    </footer>
  );
};

export default Footer;
