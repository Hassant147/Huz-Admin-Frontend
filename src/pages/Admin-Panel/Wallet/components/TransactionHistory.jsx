import TransactionHistoryIcon from "../../../../assets/TransactionHistoryIcon.svg";
import React, { useState, useEffect } from "react";
import { getPartnerOverallTransactionHistory } from "../../../../utility/Api";
import Loader from "../../../../components/loader";
const TransactionHistory = () => {
  const [formData, setFormData] = useState({
    creditAmount: "",
    debitAmount: "",
    creditTransactions: "",
    debitTransactions: "",
  });

  const [initialData, setInitialData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true); // New state for fetching loader

  useEffect(() => {
    const fetchOverallTransactions = async () => {
      const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
      if (profile) {
        const partnerSessionToken = profile.partner_session_token;
        try {
          const transactionData = await getPartnerOverallTransactionHistory(
            partnerSessionToken
          );
          if (transactionData) {
            const initialtransactionsData = {
              debitAmount:
                transactionData.debit_Transaction_mount !== undefined
                  ? transactionData.debit_Transaction_mount.toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 1, maximumFractionDigits: 1 }
                  )
                  : "0.0",

              creditAmount:
                transactionData.credit_transaction_amount !== undefined
                  ? transactionData.credit_transaction_amount.toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 1, maximumFractionDigits: 1 }
                  )
                  : "0.0",

              creditTransactions: (
                transactionData.credit_number_transactions || 0
              ).toLocaleString(),
              debitTransactions: (
                transactionData.debit_number_Transactions || 0
              ).toLocaleString(),
            };
            setFormData(initialtransactionsData);
            setInitialData(initialtransactionsData);
          }
        } catch (error) {
          console.error(error.response.data.message);
        } finally {
          setFetchingData(false); // Stop the loader once data is fetched
        }
      } else {
        setFetchingData(false); // Stop the loader if no profile is found
      }
    };

    fetchOverallTransactions();
  }, []);

  return (
    <>
      <div className="px-6 py-2.5 flex flex-row justify-between">
        <div>
          <p className="font-sans font-semibold text-[#4B465C] text-[18px] ">
            Overall Transaction history
          </p>
          <p className="font-sans font-light text-[#4B465C] text-[13px]">
            June 2024
          </p>
        </div>
        <button>
          <img src={TransactionHistoryIcon} alt="Icon not found" />
        </button>
      </div>
      <div className="px-6 py-4 flex flex-row justify-between">
        <div>
          <p className="font-sans text-[#4B465C] text-[12px]">Credit Amount</p>
          <p className="font-sans font-semibold text-[#4B465C] text-[22px]">
            {fetchingData ? (
              <div className="pt-2">
                <Loader />
              </div>
            ) : (
              formData.creditAmount
            )}
          </p>
        </div>
        <div>
          <p className="font-sans text-[#4B465C] text-[12px]">Debit Amount</p>
          <p className="font-sans font-semibold  text-[#4B465C] text-[22px]">
            {fetchingData ? (
              <div className="pt-2">
                <Loader />
              </div>
            ) : (
              formData.debitAmount
            )}
          </p>
        </div>
        <div>
          <p className="font-sans text-[#4B465C] text-[12px]">
            Debit Transactions
          </p>
          <p className="font-sans font-semibold  text-[#4B465C] text-[22px]">
            {fetchingData ? (
              <div className="pt-2">
                <Loader />
              </div>
            ) : (
              formData.creditTransactions
            )}
          </p>
        </div>
        <div>
          <p className="font-sans text-[#4B465C] text-[12px]">
            Debit Transactions
          </p>
          <p className="font-sans font-semibold  text-[#4B465C] text-[22px]">
            {" "}
            {fetchingData ? (
              <div className="pt-2">
                <Loader />
              </div>
            ) : (
              formData.debitTransactions
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default TransactionHistory;
{
  /* <div className=" max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
style={{ backgroundColor: '#FFFFFF' }}> */
}
