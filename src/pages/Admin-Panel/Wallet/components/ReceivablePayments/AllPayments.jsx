import React, { useState, useEffect } from "react";
import { fetchReceivablePayments } from "../../../../../utility/Api";
import Info from './Info'; // Import Info component from Info file
import Header from "../../../../../components/Headers/HeaderForAdminPanel";
import NavigationBar from "../../../../../components/NavigationBarForContent";
import Footer from "../../../../../components/Footers/FooterForLoggedIn";
import AccountStatementImage from "../../../../../assets/AccountsStatement.svg"; // Import the image
import Loader from "../../../../../components/loader"; // Import the loader

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

const AllPayments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchReceivablePayments();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NavigationBar />
      <div className="text-[#4B465C] my-4 w-[90%] mx-auto flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-[#4B465C] opacity-80 font-kd mb-2 sm:mb-0">
            All Receivable Payments
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : data.length === 0 ? (
          <div className="flex flex-col min-h-[400px] justify-center items-center py-8">
            <div className="flex flex-col items-center justify-center mx-auto">
              <img className="p-4" src={AccountStatementImage} alt="No img found" />
              <p className="mt-2 text-lg font-semibold text-[#4B465C] opacity-80">
                No data found
              </p>
              <p className="text-sm text-[#4B465C] opacity-60">
                Main day data is empty or try adjusting your filter.
              </p>
            </div>
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="border-2 border-[#dcdcdc] p-4 rounded-lg mb-2">
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between flex-wrap">
                <Info label="Package name" value={item.package_name} />
                <div className="hidden sm:block md:hidden lg:block border-l-2 border-gray-200 mx-2"></div>
                <Info label="Booking Number" value={item.booking_number} />
                <div className="hidden sm:block md:hidden lg:block border-l-2 border-gray-200 mx-2"></div>
                <Info label="Raised date" value={formatDate(item.create_date)} />
                <div className="hidden sm:block md:hidden lg:block border-l-2 border-gray-200 mx-2"></div>
                <Info 
                  label="Receivable amount" 
                  value={
                    <span title={item.receivable_amount}>
                      {formatAmount(parseFloat(item.receivable_amount))}
                    </span>
                  } 
                />
                <div className="hidden sm:block md:hidden lg:block border-l-2 border-gray-200 mx-2"></div>
                <Info 
                  label="Pending amount" 
                  value={
                    <span title={item.pending_amount}>
                      {formatAmount(parseFloat(item.pending_amount))}
                    </span>
                  } 
                />
                <div className="hidden sm:block md:hidden lg:block border-l-2 border-gray-200 mx-2"></div>
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
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AllPayments;
