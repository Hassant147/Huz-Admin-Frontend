import React from "react";
import DeleteIcon from "../../../../assets/DeleteIcon.svg";
import AccountStatementImage from "../../../../assets/AccountsStatement.svg";
import AdminPanelLayout from "../../../../components/layout/AdminPanelLayout";
import { useLocation } from "react-router-dom";

const AccountStatementHistory = () => {
  const location = useLocation();
  const transactions = location.state?.transactions || [];

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

  return (
    <AdminPanelLayout
      title="Account Statement History"
      subtitle="Review complete transaction history for your wallet account."
      mainClassName="py-5"
    >
      <div className="text-[#4b465c] my-1 flex-grow">
        <p className="font-bold py-3">Account Statement History</p>
        <div className="flex justify-center items-center min-h-[400px] relative sm:rounded-sm bg-gray-50">
          {transactions.length > 0 ? (
            <table className="w-full text-sm text-left border-[1px] border-[#DBDADE] rtl:text-right text-[#4b465c]">
              <thead className="text-xs text-gray-700 uppercase border-[1px] border-[#DBDADE]">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Amount:
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Transaction Time
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Transaction Type:
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Transaction description
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-2">
                      <span className="font-bold text-sm text-[#00936c]">
                        PKR
                      </span>{" "}
                      {transaction.transaction_amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-2">
                      {formatTransactionTime(transaction.transaction_time)}
                    </td>
                    <td className="py-2 px-6 text-sm">
                      {transaction.transaction_type === "Credit"
                        ? "Received"
                        : "Transferred"}
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex justify-between items-center">
                        <th
                          scope="row"
                          className="text-sm font-medium text-[#4b465c] whitespace-nowrap"
                        >
                          <div className="flex gap-1 items-center">
                            <div>
                              <p className="text-xs">
                                {transaction.transaction_description}
                              </p>
                            </div>
                          </div>
                        </th>
                        <button className="">
                          <img src={DeleteIcon} alt="Icon not found" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="flex flex-col items-center justify-center mx-auto">
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
          )}
        </div>
      </div>
    </AdminPanelLayout>
  );
};

export default AccountStatementHistory;
