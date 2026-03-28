import React from "react";
import Tabs from "./components/Tabs";
import AdminPanelLayout from "../../../components/layout/AdminPanelLayout";

const Bookings = () => {
  return (
    <AdminPanelLayout
      title="Bookings"
      subtitle="Review view-only, ready, fulfillment, reported, operator objection, completed, and history queues from one place."
      contentClassName="pb-6"
    >
      <Tabs />
    </AdminPanelLayout>
  );
};

export default Bookings;
