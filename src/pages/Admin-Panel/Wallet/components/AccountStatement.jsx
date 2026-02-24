import React, { useEffect, useState } from "react";
import AccountStatementImage from "../../../../assets/AccountsStatement.svg";
import CRLogo1 from "../../../../assets/CR-Logo1.svg";
import debitIcon from "../../../../assets/debitIcon.svg";
import { getPartnerAllTransaction } from "../../../../utility/Api";
import Loader from "../../../../components/loader";
import { useNavigate } from "react-router-dom";
import { getPartnerSessionToken } from "../../../../utility/session";

const AccountStatement = () => {
  const [transactions, setTransactions] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const historyData = await getPartnerAllTransaction(getPartnerSessionToken());
        if (historyData) {
          setTransactions(historyData);
        }
      } catch (error) {
        console.error(error?.response?.data?.message || error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchAllTransactions();
  }, []);

  const handleClick = () => {
    navigate("/accountstatementhistory", { state: { transactions } });
  };

  return (
    <div className="h-full rounded-[10px] bg-white">
      <div className="flex items-center justify-between px-6">
        <h1 className="py-4 text-lg text-[#4B465C]">Account Statement</h1>
        <button
          type="button"
          onClick={handleClick}
          className="text-sm text-brand-600 underline"
        >
          View all
        </button>
      </div>
      <div className="h-[10px] w-full bg-[#F6F6F6]" />
      <div className="w-full p-4">
        {fetchingData ? (
          <div className="flex h-[350px] items-center justify-center">
            <Loader />
          </div>
        ) : transactions.length > 0 ? (
          <div className="h-[350px] space-y-2 overflow-y-auto overflow-x-hidden pr-1">
            {transactions.slice(0, 10).map((transaction, index) => (
              <article
                key={transaction.transaction_id || `${transaction.transaction_time}-${index}`}
                className="rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-2 p-3">
                  <img
                    className="h-8 w-8"
                    src={transaction.transaction_type === "Credit" ? CRLogo1 : debitIcon}
                    alt=""
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between pb-1 text-[14px]">
                      <p className="text-[12px] text-[#4B465C]">
                        {transaction.transaction_type === "Credit"
                          ? "Fund Received"
                          : "Fund Transfer"}
                      </p>
                      <p className="text-sm font-semibold text-brand-600">
                        {Number(transaction.transaction_amount || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <p className="text-[11px] text-[#4B465C]">
                      {transaction.transaction_description}
                    </p>
                    <p className="mt-1 text-[10px] text-[#4B465C]">
                      {formatTransactionTime(transaction.transaction_time)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center py-11">
            <img className="p-4" src={AccountStatementImage} alt="No transactions" />
            <p className="mt-2 text-center text-sm text-[#121212]">
              No transaction history yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const formatTransactionTime = (isoString) => {
  const date = new Date(isoString);
  const options = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options).replace(",", "");
};

export default AccountStatement;
