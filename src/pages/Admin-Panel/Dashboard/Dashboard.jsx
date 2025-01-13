import React, { useEffect, useReducer, useState } from "react";

import Header from "../../../components/Headers/HeaderForAdminPanel";
import NavigationBar from "../../../components/NavigationBarForContent";
import Footer from "../../../components/Footers/FooterForLoggedIn";
import Loader from "../../../components/loader.js"; // Assuming you have a Loader component

import DashboardStats from "./components/DashboardStats";
import BudgetCard from "./components/BudgetCard";
import SupportTracker from "./components/SupportTracker";
import BookingCards from "./components/BookingCards";
import BalanceCard from "../../../pages/Admin-Panel/Wallet/components/BalanceCard.jsx";
import BalanceBackground from "../../../assets/BalanceBackground.svg";
import TransactionHistory from "../../../pages/Admin-Panel/Wallet/components/TransactionHistory.jsx";
import AccountStatement from "../../../pages/Admin-Panel/Wallet/components/AccountStatement.jsx";
import { initialState, reducer } from "../../../reducer/usereducer";
import { ToggleBankAccount } from "../../../pages/Admin-Panel/Wallet/wallet";
import RatingSystem from "./components/RatingSystem.jsx";

const Dashboard = () => {
  const className = ["border shadow-custom-box rounded-[10px]"];

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-[#f6f6f6]">
      <Header />
      <NavigationBar />
      <div className="w-[90%] mx-auto  space-y-4 my-5">
        <BookingCards />
        <div className="left-div w-full lg:flex lg:space-y-0 space-y-2 lg:space-x-4">
          <div
            className={`bg-[#CFE5E0] lg:w-[30%] w-full flex-grow ${className}`}
            style={{
              backgroundImage: `url(${BalanceBackground})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
            <BalanceCard />
          </div>
          <div className="row1 rounded-lg lg:w-[70%] shadow-md bg-white flex-grow">
            <TransactionHistory />
          </div>
        </div>
        <div className="w-full lg:flex lg:space-x-4 h-full">
          <ToggleBankAccount.Provider value={{ state, dispatch }}>
            <div className="flex flex-grow flex-col w-full lg:w-[30%] min-h-full">
              <AccountStatement className="flex-grow" />
            </div>
          </ToggleBankAccount.Provider>
          <div className="flex flex-grow flex-col w-full lg:w-[70%] lg:space-y-4">
            {/* Row 1 */}
            <div className="my-4 lg:my-0">
              <DashboardStats />
            </div>
            {/* Row 2 */}
            <div className="w-full lg:flex gap-4 lg:flex-row">
              <div className="lg:flex-1 lg:h-full lg:w-[33%] lg:mb-0 mb-4">
                <BudgetCard />
              </div>
              <div className="lg::flex-1 lg:h-full lg:w-[66%]">
                <SupportTracker />
              </div>
            </div>
          </div>
        </div>
        <RatingSystem />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
