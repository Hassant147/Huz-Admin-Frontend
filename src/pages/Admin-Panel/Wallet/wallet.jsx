import React, { createContext, useReducer, useState, useEffect } from "react";
import NavigationBar from "../../../components/NavigationBarForContent";
import Header from "../../../components/Headers/HeaderForAdminPanel";
import BalanceCard from "./components/BalanceCard";
import CardList from "./components/ReceivablePayments/CardList";
import TransactionHistory from "./components/TransactionHistory";
import BankAccount from "./components/BankAccount";
import AccountStatement from "./components/AccountStatement";
import DownloadAccountStatement from "./components/DownloadAccountStatement";
import WithdrawRequest from "./components/WithdrawRequest";
import BalanceBackground from "../../../assets/BalanceBackground.svg";
import { initialState, reducer } from "../../../reducer/usereducer";
import Footer from "../../../components/Footers/FooterForLoggedIn";
import "./Wallet.css";  // Import the CSS file

export const ToggleBankAccount = createContext();

const Booking = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [bankAccounts, setBankAccounts] = useState([]); // Store multiple bank accounts
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ToggleBankAccount.Provider
      value={{ state, dispatch, bankAccounts, setBankAccounts }}
    >
      <div className="flex flex-col bg-[#f6f6f6]">
        <Header />
        <NavigationBar />
        <div
          className="min-h-screen mx-auto mt-4 mb-10 w-[90%]"
          
        >
          <div className="flex flex-col md:flex-row md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6">
            <div
              className={`bg-[#CFE5E0] w-full md:w-[34%] lg:w-[30%] xl:w-[28%] card mb-4 md:mb-0`}
              style={{
                backgroundImage: `url(${BalanceBackground})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
              }}
            >
              <BalanceCard />
            </div>
            <div className="w-full md:w-[66%] lg:w-[70%] xl:w-[72%] space-y-3 lg:space-y-4 xl:space-y-5 2xl:space-y-6">
              <div className={`bg-[#FFFFFF] card`}>
                <TransactionHistory />
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 mt-3 lg:mt-4 xl:mt-5 2xl:mt-6">
            <div className={`w-full md:w-[34%] lg:w-[30%] xl:w-[28%] bg-[#FFFFFF] card mb-4 md:mb-0`}>
              <BankAccount />
            </div>
            <div className="flex flex-col md:flex-row gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 w-full md:w-[66%] lg:w-[70%] xl:w-[72%]">
              <div className={`w-full md:w-[50%] bg-white card`}>
                <AccountStatement />
              </div>
              <div className="flex flex-col space-y-3 lg:space-y-4 xl:space-y-5 2xl:space-y-6 w-full md:w-[50%]">
                <div className={`bg-[#FFFFFF] card`}>
                  <WithdrawRequest />
                </div>
                <div className={`bg-[#57726A] card`}>
                  <DownloadAccountStatement />
                </div>
              </div>
            </div>
          </div>
          <div id="card-list-container" className="mt-3 lg:mt-4 xl:mt-5 2xl:mt-6">
            <CardList />
          </div>
        </div>
      </div>
      <Footer />
    </ToggleBankAccount.Provider>
  );
};

export default Booking;
