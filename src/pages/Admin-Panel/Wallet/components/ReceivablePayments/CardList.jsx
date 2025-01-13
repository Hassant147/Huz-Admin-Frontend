import React, { useState, useEffect } from "react";
import { fetchReceivablePayments } from "../../../../../utility/Api";
import { Link } from "react-router-dom";
import Info from './Info'; // Import Info component from Info file
import Loader from '../../../../../components/loader'; // Import your custom loader component
import AccountStatementImage from "../../../../../assets/AccountsStatement.svg"; // Import your image

// Utility function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}

// Utility function to format the amount
const formatAmount = (amount) => amount.toFixed(1);

// Card Component
const CardComponent = ({ data }) => (
  <div className="">
    {data.map((item, index) => (
      <div key={index} className="border-2 border-[#dcdcdc] p-4 rounded-lg mb-2">
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between flex-wrap">
          <Info label="Package name" value={item.package_name} />
          <div className="hidden sm:block md:hidden lg:block border-l-2 border-gray-200 mx-2"></div>
          <Info label="Booking Number" value={item.booking_number} />
          <div className="hidden sm:block md:hidden lg:block border-l-2 border-gray-200 mx-2"></div>
          <Info label="Raised date" value={formatDate(item.create_date)} />
          <div className="hidden sm:block md:hidden lg:block border-l-2 border-gray-200 mx-2"></div>
          <div className="flex items-center">
            <Info
              label="Receivable amount"
              value={
                <span title={item.receivable_amount}>
                  {formatAmount(parseFloat(item.receivable_amount))}
                </span>
              }
            />
          </div>
          <div className="hidden sm:block md:hidden lg:block border-l-2 border-gray-200 mx-2"></div>
          <div className="flex items-center">
            <Info
              label="Pending amount"
              value={
                <span title={item.pending_amount}>
                  {formatAmount(parseFloat(item.pending_amount))}
                </span>
              }
            />
          </div>
          <div className="hidden sm:block md:hidden lg:block border-l-2 border-gray-200 mx-2"></div>
          <div className="flex items-center">
            <Info
              label="Processed amount"
              value={
                <span title={item.processed_amount}>
                  {formatAmount(parseFloat(item.processed_amount))}
                </span>
              }
            />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Card List Component
const CardList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchReceivablePayments();
        if (result.message === "No payment records found for the user.") {
          setNoData(true);
        } else {
          setData(result.slice(0, 5)); // Show only the first 5 payments
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 md:p-8 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-[#4B465C] opacity-80 font-kd mb-2 sm:mb-0">
          Receivable Payments
        </h2>
        <Link to="/all-payments" className="text-[#4B465C] opacity-80 font-medium font-kd">
          View all
        </Link>
      </div>
      {noData ? (
        <div className="text-center py-8">
          <img src={AccountStatementImage} alt="No records" className="mx-auto mb-4" />
          <p className="text-lg font-semibold text-[#4B465C] opacity-80">
            No record exist
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg font-semibold text-[#4B465C] opacity-80">
            No data found
          </p>
          <p className="text-sm text-[#4B465C] opacity-60">
            Main day data is empty or try adjusting your filter.
          </p>
        </div>
      ) : (
        <CardComponent data={data} />
      )}
    </div>
  );
};

export default CardList;
