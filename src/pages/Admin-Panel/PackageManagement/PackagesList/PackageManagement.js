import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPackages, fetchTransportPackage } from "../../../../utility/Api";
import Sidebar from "./Sidebar";
import PackageList from "./PackageList";
import AdminPanelLayout from "../../../../components/layout/AdminPanelLayout";
import Loader from "../../../../components/loader";
import Card from "./TransportCard";
import Pagination from "./Pagination";
import StatusBar from "./StatusBar";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/square.svg";
import bgLogo from "../../../../assets/bgLogo.svg";
import Error from "./Error";
import errorLogo from "../../../../assets/error.svg";
import { AppButton, AppCard, AppSectionHeader } from "../../../../components/ui";

const PackageManagement = () => {
  const [selectedPackageType, setSelectedPackageType] = useState("Hajj");
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [packages, setPackages] = useState([]);
  const [packagesTotal, setPackagesTotal] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [transportPackages, setTransportPackages] = useState([]);
  const packagesPerPage = 5;
  const transportPackagesPerPage = 8;
  const navigate = useNavigate();

  const normalizedStatus = useMemo(
    () => (selectedStatus === "In Progress" ? "Initialize" : selectedStatus),
    [selectedStatus]
  );

  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (selectedPackageType === "Transport") {
        const { data, error } = await fetchTransportPackage();
        setTransportPackages(data?.results || []);
        setError(error);
      } else {
        const { data, error } = await fetchPackages(
          selectedPackageType,
          normalizedStatus,
          currentPage
        );
        setPackages(data?.results || []);
        setPackagesTotal(data?.count || data?.results?.length || 0);
        setError(error);
      }
    } catch (error) {
      setError("Failed to load packages");
      setPackages([]);
      setPackagesTotal(0);
      setTransportPackages([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, normalizedStatus, selectedPackageType]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  const handleClick = () => {
    navigate("/package-type");
  };

  const filteredTransportPackages = useMemo(
    () =>
      (transportPackages || []).filter((pkg) => pkg.package_status === normalizedStatus),
    [normalizedStatus, transportPackages]
  );

  const paginatedTransportPackages = useMemo(() => {
    const start = (currentPage - 1) * transportPackagesPerPage;
    const end = start + transportPackagesPerPage;
    return filteredTransportPackages.slice(start, end);
  }, [currentPage, filteredTransportPackages]);

  useEffect(() => {
    if (selectedPackageType !== "Transport") {
      return;
    }

    const maxPage = Math.max(1, Math.ceil(filteredTransportPackages.length / transportPackagesPerPage));
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [currentPage, filteredTransportPackages.length, selectedPackageType]);

  const totalItems =
    selectedPackageType === "Transport" ? filteredTransportPackages.length : packagesTotal;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTypeChange = (type) => {
    setSelectedPackageType(type);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  return (
    <AdminPanelLayout
      title="Package Management"
      subtitle="Manage all packages, status filters, and transport listings."
      mainClassName="py-5 app-main-shell"
    >
      <div className="app-content-stack pb-8">
        <AppCard
          className="relative overflow-hidden border-0 text-white"
          style={{
            background:
              "linear-gradient(130deg, rgba(7,106,80,0.96) 0%, rgba(11,151,110,0.96) 48%, rgba(9,121,110,0.96) 100%)",
            backgroundImage: `url(${bgLogo})`,
            backgroundSize: "cover",
            backgroundPosition: "right center",
          }}
        >
          <AppSectionHeader
            title="All Packages"
            subtitle="Track, filter, and update your published package inventory."
            titleClassName="!text-white"
            subtitleClassName="!text-white/90"
            action={
              <AppButton
                variant="ghost"
                size="sm"
                className="!bg-white !text-brand-600 border-white/80"
                startIcon={<img src={logo} alt="" className="h-3.5" />}
                onClick={handleClick}
              >
                Add New Package
              </AppButton>
            }
          />
        </AppCard>

        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Sidebar onFilterChange={handleTypeChange} />
          <div className="app-content-stack">
            {!error ? (
              <StatusBar selectedStatus={selectedStatus} onStatusChange={handleStatusChange} />
            ) : null}

            {loading ? (
              <AppCard className="min-h-[380px] flex items-center justify-center">
                <Loader />
              </AppCard>
            ) : error ? (
              <Error errorLogo={errorLogo} error={error} />
            ) : selectedPackageType === "Transport" ? (
              paginatedTransportPackages.length > 0 ? (
                <div className="app-content-stack">
                  {paginatedTransportPackages.map((transportPackage) => (
                    <Card
                      key={transportPackage.transport_token}
                      imageUrl={`${process.env.REACT_APP_API_BASE_URL}${transportPackage.vehicle_photos}`}
                      title={transportPackage.name_and_model}
                      type={transportPackage.transport_type}
                      capacity={transportPackage.sitting_capacity}
                      availability={transportPackage.availability}
                      route1={transportPackage.common_1}
                      route2={transportPackage.common_2}
                      price={transportPackage.cost}
                      packageType={transportPackage.package_type}
                      transportPackage={transportPackage}
                      setSelectedStatus={handleStatusChange}
                    />
                  ))}
                  <Pagination
                    totalItems={totalItems}
                    itemsPerPage={transportPackagesPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              ) : (
                <Error errorLogo={errorLogo} error="No transport packages available." />
              )
            ) : packages.length > 0 ? (
              <>
                <PackageList packages={packages} />
                <Pagination
                  totalItems={totalItems}
                  itemsPerPage={packagesPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <Error
                errorLogo={errorLogo}
                error={`No ${selectedPackageType} packages available for ${selectedStatus} status.`}
              />
            )}
          </div>
        </div>
      </div>
    </AdminPanelLayout>
  );
};

export default PackageManagement;
