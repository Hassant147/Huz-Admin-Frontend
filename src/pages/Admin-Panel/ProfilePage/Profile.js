import React, { useState, useEffect } from "react";
import AdminPanelLayout from "../../../components/layout/AdminPanelLayout";
import { AppButton, AppCard } from "../../../components/ui";
import UserInfoComponent from "./UserInfoComponent";
import SidebarForCompany from "./SidebarForCompany";
import SidebarForIndividual from "./SidebarForIndividual";
import NavTabs from "./NavTabs";

import CompanyDetail from "./CompanyDetail";
import IndividualDetail from "./IndividualDetail"; // Assume this component exists
import AddressDetail from "./AddressDetail";
import ChangePassword from "./ChangePassword";
import { useAdminAuth } from "../../../utility/adminSession";
import { getStoredPartnerProfile } from "../../../utility/partnerSession";

import Loader from "react-js-loader";

const AdminSessionProfileView = () => {
  const { user, refreshSession } = useAdminAuth();

  const sessionFields = [
    {
      label: "Name",
      value: user?.name || user?.username || "Admin",
    },
    {
      label: "Username",
      value: user?.username || "Not provided",
    },
    {
      label: "Email",
      value: user?.email || "Not provided",
    },
    {
      label: "Role",
      value: user?.role || "admin",
    },
  ];

  return (
    <AdminPanelLayout
      title="My Profile"
      subtitle="Review the active admin session details sourced from the backend session API."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <AppCard className="border-slate-200">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">
                Admin Identity
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink-900">
                {user?.name || user?.username || "Admin"}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-500">
                This profile view is backed by `/management/auth/me/` and no longer reads partner
                profile state from local storage.
              </p>
            </div>
            <AppButton variant="outline" size="sm" onClick={() => refreshSession()}>
              Refresh Session
            </AppButton>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {sessionFields.map((field) => (
              <div key={field.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-300">
                  {field.label}
                </p>
                <p className="mt-1 text-sm font-medium text-ink-900">{field.value}</p>
              </div>
            ))}
          </div>
        </AppCard>

        <AppCard className="border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">
            Session Status
          </p>
          <h3 className="mt-2 text-lg font-semibold text-ink-900">Authenticated</h3>
          <p className="mt-2 text-sm text-ink-500">
            Admin-only routes in this app now resolve identity from the backend-managed session
            instead of partner storage keys.
          </p>
        </AppCard>
      </div>
    </AdminPanelLayout>
  );
};

const Profile = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [selectedTab, setSelectedTab] = useState("company");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      setProfile(null);
      return;
    }

    const storedProfile = getStoredPartnerProfile();
    if (!storedProfile) {
      setProfile(null);
      return;
    }

    setProfile(storedProfile);
  }, [isAuthenticated]);

  const renderSidebar = () => {
    if (profile) {
      return profile.partner_type === "Individual" ? (
        <SidebarForIndividual />
      ) : (
        <SidebarForCompany className="h-20" />
      );
    }
    return null;
  };

  const renderTabContent = () => {
    if (!profile) return null;

    switch (selectedTab) {
      case "company":
        return profile.partner_type === "Individual" ? (
          <IndividualDetail />
        ) : (
          <CompanyDetail />
        );
      case "address":
        return <AddressDetail />;
      case "password":
        return <ChangePassword />;
      default:
        return profile.partner_type === "Individual" ? (
          <IndividualDetail />
        ) : (
          <CompanyDetail />
        );
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader
          type="spinner-cub"
          bgColor="#00936c"
          color="#00936c"
          title="Loading"
          size={50}
        />
      </div>
    );
  }

  if (isAuthenticated) {
    return <AdminSessionProfileView />;
  }

  if (!profile) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader
          type="spinner-cub"
          bgColor="#00936c"
          color="#00936c"
          title="Loading"
          size={50}
        />
      </div>
    );
  }

  return (
    <AdminPanelLayout useContainer={false} mainClassName="bg-gray-100 py-0">
      <UserInfoComponent />
      <main className="w-[90%] mx-auto py-6">
        <div className="mb-8">
          <NavTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </div>
        <div className="lg:flex lg:space-y-0 space-y-4 lg:space-x-4 items-start">
          {renderSidebar()}
          {renderTabContent()}
        </div>
      </main>
    </AdminPanelLayout>
  );
};

export default Profile;
