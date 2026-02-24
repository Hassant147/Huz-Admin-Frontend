import React, { useReducer } from "react";
import AdminPanelLayout from "../../../components/layout/AdminPanelLayout";

import DashboardStats from "./components/DashboardStats";
import BudgetCard from "./components/BudgetCard";
import SupportTracker from "./components/SupportTracker";
import BookingCards from "./components/BookingCards";
import BalanceCard from "../../../pages/Admin-Panel/Wallet/components/BalanceCard.jsx";
import BalanceBackground from "../../../assets/BalanceBackground.svg";
import TransactionHistory from "../../../pages/Admin-Panel/Wallet/components/TransactionHistory.jsx";
import AccountStatement from "../../../pages/Admin-Panel/Wallet/components/AccountStatement.jsx";
import { initialState, reducer } from "../../../reducer/usereducer";
import { ToggleBankAccount } from "../../../pages/Admin-Panel/Wallet/context";
import RatingSystem from "./components/RatingSystem.jsx";
import { AppCard } from "../../../components/ui";

const Dashboard = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AdminPanelLayout
      title="Dashboard"
      subtitle="Monitor your bookings, payments, and operational performance in one place."
      mainClassName="py-5"
    >
      <div className="app-content-stack">
        <BookingCards />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)]">
          <AppCard
            className="overflow-hidden"
            padded={false}
            style={{
              background: "linear-gradient(180deg, #d6ece6, #edf7f4)",
              backgroundImage: `url(${BalanceBackground})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
            <BalanceCard />
          </AppCard>
          <AppCard padded={false}>
            <TransactionHistory />
          </AppCard>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2.15fr)]">
          <ToggleBankAccount.Provider value={{ state, dispatch }}>
            <AppCard className="h-full" padded={false}>
              <AccountStatement className="h-full" />
            </AppCard>
          </ToggleBankAccount.Provider>
          <div className="app-content-stack">
            <DashboardStats />
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <BudgetCard />
              <SupportTracker />
            </div>
          </div>
        </div>
        <RatingSystem />
      </div>
    </AdminPanelLayout>
  );
};

export default Dashboard;
