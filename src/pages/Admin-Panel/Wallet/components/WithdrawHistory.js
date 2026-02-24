import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getWithdrawRequest } from "../../../../utility/Api";
import AdminPanelLayout from "../../../../components/layout/AdminPanelLayout";
import DeleteIcon from "../../../../assets/DeleteIcon.svg";
import Loader from "../../../../components/loader";
import AccountStatementImage from "../../../../assets/AccountsStatement.svg";

const WithdrawHistory = () => {
  const [fetchingData, setFetchingData] = useState(true); // New state for fetching loader
  const [bankAccounts, setBankAccounts] = useState([]);
  useEffect(() => {
    const fetchBankAccounts = async () => {
      const profile = JSON.parse(localStorage.getItem("SignedUp-User-Profile"));
      if (profile) {
        const partnerSessionToken = profile.partner_session_token;
        try {
          const AccountData = await getWithdrawRequest(partnerSessionToken);
          if (AccountData) {
            setBankAccounts(AccountData); // Save the fetched accounts to state
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

    fetchBankAccounts();
  }, []);
  return (
    <AdminPanelLayout
      title="Withdrawal History"
      subtitle="Review withdraw requests and their current processing status."
      mainClassName="py-5"
    >
      <div className="text-[#4b465c] my-1 flex-grow">
        <p className="font-bold py-3">Withdrawal History</p>

        <div className="relative sm:rounded-sm bg-gray-50">
          <table className="w-full text-sm text-left border-[1px] border-[#DBDADE] rtl:text-right text-[#4b465c] ">
            <thead className="text-xs text-gray-700 uppercase border-[1px] border-[#DBDADE] ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Account Detail:
                </th>
                <th scope="col" className="px-6 py-3">
                  Request Time:
                </th>
                <th scope="col" className="px-6 py-3">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Process Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {fetchingData ? (
                <div className="h-[350px] flex justify-center items-center">
                  <Loader />
                </div>
              ) : bankAccounts.length > 0 ? (
                bankAccounts.map((account) => (
                  <tr className=" border-b hover:bg-gray-50 ">
                    <th
                      scope="row"
                      className="p-4 py-2 text-sm font-medium text-[#4b465c] whitespace-nowrap"
                    >
                      <div className="flex gap-1 items-center">
                        <img src="/BANK/ztbl.png" alt="" className="h-10" />
                        <div>
                          <p>{account.account_title}</p>{" "}
                          <p className="opacity-50 text-xs">
                            {account.account_number}
                          </p>
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-2">{account.request_time}</td>
                    <td className="px-6 py-2">
                      <span className="font-bold text-sm text-[#00936c]">
                        PKR
                      </span>{" "}
                      {account.withdraw_amount}
                    </td>
                    <td className="px-6 py-2">{account.process_time}</td>
                    <td className="px-6 py-2 ">
                      <div className="flex justify-between items-center">
                        <p className="bg-[#d2ebde] p-1 px-4 rounded-sm text-sm font-semibold">
                          {account.withdraw_status}
                        </p>
                        <button className="">
                          <img src={DeleteIcon} alt="Icon not found" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <div className="py-10">
                      <div className="flex flex-col items-center justify-center">
                        <img
                          className="p-4"
                          src={AccountStatementImage}
                          alt="No img found"
                        />
                        <p className="mt-2 text-sm text-center text-[#121212]">
                          No data yet
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPanelLayout>
  );
};

export default WithdrawHistory;
