import React, { useEffect, useState } from "react";
import TransactionHistoryIcon from "../../../../assets/TransactionHistoryIcon.svg";
import { getPartnerOverallTransactionHistory } from "../../../../utility/Api";
import Loader from "../../../../components/loader";
import { getPartnerSessionToken } from "../../../../utility/session";

const TransactionHistory = () => {
  const [summary, setSummary] = useState({
    creditAmount: "0.0",
    debitAmount: "0.0",
    creditTransactions: "0",
    debitTransactions: "0",
  });
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const fetchOverallTransactions = async () => {
      try {
        const transactionData = await getPartnerOverallTransactionHistory(
          getPartnerSessionToken()
        );

        if (transactionData) {
          setSummary({
            debitAmount:
              transactionData.debit_Transaction_mount !== undefined
                ? transactionData.debit_Transaction_mount.toLocaleString("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })
                : "0.0",
            creditAmount:
              transactionData.credit_transaction_amount !== undefined
                ? transactionData.credit_transaction_amount.toLocaleString("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })
                : "0.0",
            creditTransactions: (
              transactionData.credit_number_transactions || 0
            ).toLocaleString(),
            debitTransactions: (
              transactionData.debit_number_Transactions || 0
            ).toLocaleString(),
          });
        }
      } catch (error) {
        console.error(error?.response?.data?.message || error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchOverallTransactions();
  }, []);

  return (
    <>
      <div className="flex flex-row justify-between px-6 py-2.5">
        <div>
          <p className="text-[18px] font-semibold text-[#4B465C]">Overall Transaction History</p>
          <p className="text-[13px] font-light text-[#4B465C]">Latest summary</p>
        </div>
        <button type="button" aria-label="Transaction history">
          <img src={TransactionHistoryIcon} alt="Transaction history" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 px-6 py-4 lg:grid-cols-4">
        <SummaryItem label="Credit Amount" value={summary.creditAmount} loading={fetchingData} />
        <SummaryItem label="Debit Amount" value={summary.debitAmount} loading={fetchingData} />
        <SummaryItem
          label="Credit Transactions"
          value={summary.creditTransactions}
          loading={fetchingData}
        />
        <SummaryItem
          label="Debit Transactions"
          value={summary.debitTransactions}
          loading={fetchingData}
        />
      </div>
    </>
  );
};

const SummaryItem = ({ label, value, loading }) => (
  <div>
    <p className="text-[12px] text-[#4B465C]">{label}</p>
    <p className="text-[22px] font-semibold text-[#4B465C]">
      {loading ? (
        <span className="inline-block pt-2">
          <Loader />
        </span>
      ) : (
        value
      )}
    </p>
  </div>
);

export default TransactionHistory;
