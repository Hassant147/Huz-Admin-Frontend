import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoContent from "../../../components/NoContent";
import { fetchApprovedCompanies } from "../../../utility/Super-Admin-Api";
import BackButton from "../../../components/BackButton";

const AccessProfilePage = () => {
  const [companies, setCompanies] = useState([]); // State to store the fetched companies
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 5; // Number of items per page
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchData = async () => {
      const { status, data, error } = await fetchApprovedCompanies();

      if (status === 200 && data.length > 0) {
        // Filter out companies with null partner_type_and_detail
        const validCompanies = data.filter(
          (company) => company.partner_type_and_detail !== null
        );
        setCompanies(validCompanies);
      } else if (status === 404) {
        setCompanies([]); // No content found
      } else {
        setError(error || "An error occurred while fetching data.");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Calculate the index range for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = companies.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle clicking on "Access" button
  const handleAccessClick = (company) => {
    // Store the selected company profile in local storage
    localStorage.setItem("SignedUp-User-Profile", JSON.stringify(company));
    // Navigate to the partner's dashboard
    console.log(company);
    navigate("/partner-dashboard");
  };

  // Calculate total pages
  const totalPages = Math.ceil(companies.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-[90%] mx-auto">
      <BackButton />
        {companies.length > 0 ? (
          <>
            <h1 className="text-2xl text-gray-700 mb-6">
              Access Partner Profiles
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 w-full">
              {currentItems.map((company, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row items-center lg:items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-full"
                >
                  {/* Company details */}
                  <div className="w-full items-center lg:w-[24%] mb-4 lg:mb-0">
                    <h2 className="text-sm text-gray-700">
                      {company.partner_type_and_detail?.company_name ||
                        "Company name not provided"}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {company.address || "City not provided"} |{" "}
                      {company.country_code}
                      {company.phone_number}
                    </p>
                  </div>

                  {/* Other details */}
                  <div className="w-full lg:w-[24%] mb-4 lg:mb-0">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[#7367F0] font-semibold text-xl">
                          {company.name ? company.name[0].toUpperCase() : "N/A"}
                        </div>
                      </div>
                      <div className="ml-4 items-center">
                        <p className="text-sm text-gray-700">
                          {company.name || "Full name not provided"}
                        </p>
                        <p className="text-xs text-gray-500">{company.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="w-full lg:w-[48%] mb-4 lg:mb-0 lg:text-start px-4 items-center lg:border-l lg:border-r text-start">
                    <p className="text-sm text-gray-700 text-justify">
                      {company.address || "No Address to show"}
                    </p>
                  </div>

                  {/* Access Button */}
                  <div className="w-full lg:w-auto text-right lg:flex-1 items-center justify-end lg:flex ml-6">
                    <button
                      className="text-[#00936c] font-semibold border border-[#00936C] rounded px-2 lg:px-3 py-1 hover:bg-[#00936C] hover:text-white"
                      onClick={() => handleAccessClick(company)}
                    >
                      Access
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`px-3 py-1 mx-1 rounded ${
                      currentPage === pageNumber
                        ? "bg-[#00936C] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>
          </>
        ) : (
          <NoContent />
        )}
      </div>
    </div>
  );
};

export default AccessProfilePage;
