import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./DetailProfileComponents/Sidebar";
import CompanyInfoCard from "./DetailProfileComponents/CompanyInfoCard";
import ActionSection from "./DetailProfileComponents/ActionSection";
import BackButton from "../../../../components/BackButton";

const ProfileApprovalPage = () => {
  const location = useLocation();
  const { company } = location.state; // Access the company object passed from ApproveProfilePage

  const handleActionSubmit = (data) => {
    // Handle additional logic after form submission if needed
    console.log("Form submitted with:", data);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-[90%] mx-auto ">
      <BackButton />
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-1/4 w-full lg:mr-6 mb-6 lg:mb-0">
          <Sidebar company={company} />
        </div>

        {/* Main content */}
        <div className="flex-grow">
          <CompanyInfoCard company={company} />
          <ActionSection company={company} onSubmit={handleActionSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ProfileApprovalPage;
