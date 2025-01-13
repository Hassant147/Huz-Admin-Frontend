import React, { useState, useEffect, useContext } from "react";
import AccountStatementImage from "../../../../assets/AccountsStatement.svg";
import CRLogo1 from "../../../../assets/CR-Logo1.svg";
import debitIcon from "../../../../assets/debitIcon.svg";
import { ToggleBankAccount } from "../wallet";
import { getPartnerAllTransaction } from "../../../../utility/Api";
import Loader from "../../../../components/loader";
import { useNavigate } from "react-router-dom";

const AccountStatement = () => {
  const { state, dispatch } = useContext(ToggleBankAccount);
  const [formData, setFormData] = useState({
    transaction_amount: "",
    transaction_type: "",
    transaction_time: "",
    transaction_description: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [initialData, setInitialData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true); // New state for fetching loader
  const navigate = useNavigate();
  useEffect(() => {
    const fetchallTransactions = async () => {
      const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
      if (profile) {
        const partnerSessionToken = profile.partner_session_token;
        try {
          const historyData = await getPartnerAllTransaction(
            partnerSessionToken
          );
          if (historyData) {
            setTransactions(historyData);
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

    fetchallTransactions();
  }, []);


  function formatTransactionTime(isoString) {
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
  }
  const handleClick = () => {
    navigate("/accountstatementhistory", { state: { transactions } });
  };

  return (
    <div className="bg-white rounded-[10px] h-full">
      <div className="flex px-6 items-center justify-between">
        <h1 className="text-lg py-4 text-[#4B465C]">Account Statement</h1>
        {/* <img src={AccountStatementIcon} alt="Icon not found" /> */}
        <a
          onClick={handleClick}
          className="text-[#7367F0] text-sm underline cursor-pointer"
        >
          View all
        </a>
      </div>
      <div className="w-[100%] h-[10px] bg-[#F6F6F6] "></div>
      <div className=" p-4 rounded-b-lg w-full max-w-md flex flex-col ">
        {fetchingData ? (
          <div className="h-[350px] flex justify-center items-center">
            <Loader />
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div
              key={index}
              className="h-[350px] overflow-y-auto overflow-x-hidden"
            >
              <div className="pl-2 pr-2 rounded-lg w-full max-w-md flex flex-col ">
                <div className="flex flex-row border-2 border-gray-200 rounded items-center">
                  {transaction.transaction_type === "Credit" ? (
                    <img className="pl-3 pr-1" src={CRLogo1} alt="" />
                  ) : (
                    <img className="pl-3 pr-1" src={debitIcon} alt="" />
                  )}
                  <div className="flex flex-col p-3">
                    <div className="pb-1 flex justify-between items-center font-poppins text-[14px] text-[#00936C]">
                      <p className="font-poppins text-[#4B465C] text-[12px]">
                        {transaction.transaction_type === "Credit"
                          ? "Fund Received"
                          : "Fund Transfer"}
                      </p>
                      <p className="ml-auto">
                        {transaction.transaction_amount.toLocaleString(
                          "en-US",
                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        )}
                      </p>
                    </div>
                    <p className="font-poppins text-[#4B465C] text-[10px]">
                      {transaction.transaction_description}
                    </p>
                  </div>
                </div>
                <p className="font-poppins p-2 text-[#4B465C] text-[10px]">
                  {formatTransactionTime(transaction.transaction_time)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className=" rounded-lg w-full py-11 max-w-md items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <img
                className="p-4"
                src={AccountStatementImage}
                alt="No img found"
              />
              <p className="mt-2 text-sm text-center text-[#121212] font-poppins">
                No transaction history yet
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountStatement;
