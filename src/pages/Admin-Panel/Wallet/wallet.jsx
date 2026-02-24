import React, { useReducer, useState } from "react";
import BalanceCard from "./components/BalanceCard";
import CardList from "./components/ReceivablePayments/CardList";
import TransactionHistory from "./components/TransactionHistory";
import BankAccount from "./components/BankAccount";
import AccountStatement from "./components/AccountStatement";
import DownloadAccountStatement from "./components/DownloadAccountStatement";
import WithdrawRequest from "./components/WithdrawRequest";
import BalanceBackground from "../../../assets/BalanceBackground.svg";
import { initialState, reducer } from "../../../reducer/usereducer";
import AdminPanelLayout from "../../../components/layout/AdminPanelLayout";
import { ToggleBankAccount } from "./context";
import { AppCard } from "../../../components/ui";

const Booking = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [bankAccounts, setBankAccounts] = useState([]); // Store multiple bank accounts

  return (
    <ToggleBankAccount.Provider
      value={{ state, dispatch, bankAccounts, setBankAccounts }}
    >
      <AdminPanelLayout
        title="Wallet"
        subtitle="Track your balance, bank accounts, transactions, and withdraw requests."
        mainClassName="py-5"
      >
        <div className="app-content-stack">
          <div className="grid gap-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,2.05fr)]">
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
          <div className="grid gap-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,2.05fr)]">
            <AppCard padded={false}>
              <BankAccount />
            </AppCard>
            <div className="grid gap-4 md:grid-cols-2">
              <AppCard padded={false}>
                <AccountStatement />
              </AppCard>
              <div className="app-content-stack">
                <AppCard padded={false}>
                  <WithdrawRequest />
                </AppCard>
                <AppCard
                  className="text-white border-0"
                  padded={false}
                  style={{
                    background: "linear-gradient(135deg, #506174, #3f4f62)",
                  }}
                >
                  <DownloadAccountStatement />
                </AppCard>
              </div>
            </div>
          </div>
          <div id="card-list-container">
            <CardList />
          </div>
        </div>
      </AdminPanelLayout>
    </ToggleBankAccount.Provider>
  );
};

export default Booking;
