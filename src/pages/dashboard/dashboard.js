import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Retrieve user data from local storage
  const userData = JSON.parse(localStorage.getItem("user-data"));

  return (
    <main className="font-sans bg-gray-50">
      <div className="flex w-[90%] flex-col min-h-screen mx-auto py-12">
        <header className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-700">
            Welcome {userData ? userData.name : "User"}!
          </h1>
          <p className="text-gray-500">Super Admin</p>
        </header>
        <main className="flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/access-profile"
              className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="text-lg font-medium text-gray-700">Access</h3>
              <p className="text-gray-500 text-sm">Partners Profiles</p>
            </Link>
            <Link
              to="/pending-profiles"
              className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="text-lg font-medium text-gray-700">Pending</h3>
              <p className="text-gray-500 text-sm">Partner Profiles</p>
            </Link>
            <Link
              to="/approve-amounts"
              className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="text-lg font-medium text-gray-700">Approve</h3>
              <p className="text-gray-500 text-sm">Pending Amounts</p>
            </Link>
            <Link
              to="/approve-partners-amounts"
              className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="text-lg font-medium text-gray-700">Approve</h3>
              <p className="text-gray-500 text-sm">
                Pending Amounts of Partners
              </p>
            </Link>
          </div>
        </main>
      </div>
    </main>
  );
};

export default Dashboard;
