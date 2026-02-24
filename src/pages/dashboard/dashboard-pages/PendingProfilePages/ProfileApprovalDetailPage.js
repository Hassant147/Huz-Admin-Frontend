import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./DetailProfileComponents/Sidebar";
import CompanyInfoCard from "./DetailProfileComponents/CompanyInfoCard";
import ActionSection from "./DetailProfileComponents/ActionSection";
import { AppButton, AppCard, AppEmptyState } from "../../../../components/ui";
import errorIcon from "../../../../assets/error.svg";
import SuperAdminModuleShell from "../../components/SuperAdminModuleShell";

const ProfileApprovalPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const company = location.state?.company;

  if (!company) {
    return (
      <SuperAdminModuleShell
        title="Profile Approval"
        subtitle="Review profile details and decide approval."
      >
        <AppCard>
          <AppEmptyState
            icon={<img src={errorIcon} alt="" className="h-6 w-6" />}
            title="Profile not loaded"
            message="Open a profile from the pending profiles list to continue."
            action={
              <AppButton
                size="sm"
                onClick={() => navigate("/pending-profiles")}
              >
                Go to Pending Profiles
              </AppButton>
            }
          />
        </AppCard>
      </SuperAdminModuleShell>
    );
  }

  return (
    <SuperAdminModuleShell
      title="Profile Approval"
      subtitle="Validate company profile information and apply an approval decision."
    >
      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Sidebar company={company} />
        <div className="app-content-stack">
          <CompanyInfoCard company={company} />
          <ActionSection company={company} />
        </div>
      </div>
    </SuperAdminModuleShell>
  );
};

export default ProfileApprovalPage;
