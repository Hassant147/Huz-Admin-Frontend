import React from "react";
import Tabs from "./components/Tabs";
import AdminPanelLayout from "../../../components/layout/AdminPanelLayout";

const Bookings = () => {
  return (
    <AdminPanelLayout
      title="Bookings"
      subtitle="Review your active, pending, completed, and closed bookings from one place."
      contentClassName="pb-6"
    >
      <Tabs />
    </AdminPanelLayout>
  );
};

export default Bookings;
