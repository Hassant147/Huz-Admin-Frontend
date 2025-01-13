import React, { useState, useEffect } from "react";
import { fetchPackages, fetchTransportPackage } from "../../../../utility/Api";
import Sidebar from "./Sidebar";
import PackageList from "./PackageList";
import Header from "../../../../components/Headers/HeaderForAdminPanel";
import Footer from "../../../../components/Footers/FooterForLoggedIn";
import NavigationBar from "../../../../components/NavigationBarForContent";
import Loader from "../../../../components/loader";
import Card from "./TransportCard";
import Pagination from "./Pagination";
import StatusBar from "./StatusBar";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/square.svg";
import bgLogo from "../../../../assets/bgLogo.svg";
import Error from "./Error";
import errorLogo from "../../../../assets/error.svg";

const PackageManagement = () => {
  const [selectedPackageType, setSelectedPackageType] = useState("Hajj");
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [transportPackages, setTransportPackages] = useState([]);
  const packagesPerPage = 5;
  const transportPackagesPerPage = 10;

  const loadPackages = async (type, status, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      if (type === "Transport") {
        const { data, error } = await fetchTransportPackage();
        setTransportPackages(data?.results || []);
        setError(error);
      } else {
        const { data, error } = await fetchPackages(type, status, page);
        setPackages(data?.results || []);
        setError(error);
      }
    } catch (err) {
      setError("Failed to load packages");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPackages(selectedPackageType, selectedStatus, currentPage);
  }, [selectedPackageType, selectedStatus, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadPackages(selectedPackageType, selectedStatus, page);
  };
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/package-type");
  };
  const handleDeactivate = (transportToken) => {
    setTransportPackages((prevPackages) =>
      prevPackages.filter((pkg) => pkg.transport_token !== transportToken)
    );
  };

  const indexOfLastTransportPackage = currentPage * transportPackagesPerPage;
  const indexOfFirstTransportPackage =
    indexOfLastTransportPackage - transportPackagesPerPage;
  const currentTransportPackages =
    transportPackages &&
    Array.isArray(transportPackages) &&
    transportPackages.slice(
      indexOfFirstTransportPackage,
      indexOfLastTransportPackage
    );

  const filteredTransportPackages =
    currentTransportPackages &&
    Array.isArray(currentTransportPackages) &&
    currentTransportPackages.filter((pkg) => {
      if (selectedStatus === "In Progress") {
        return pkg.package_status === "Initialize";
      }
      return pkg.package_status === selectedStatus;
    });

  const filteredPackages =
    packages &&
    Array.isArray(packages) &&
    packages.filter((pkg) => {
      if (selectedStatus === "In Progress") {
        return pkg.package_status === "Initialize";
      }
      return pkg.package_status === selectedStatus;
    });

  return (
    <div>
      <div className="flex flex-col bg-[#f6f6f6]">
        <Header />
        <NavigationBar />
        <div className="w-[90%] min-h-screen mx-auto mt-4 mb-10">
          <div
            className="md:flex text-white p-3 space-y-2 md:space-y-0 mb-4 md:px-8 md:py-6 xl:px-12 rounded-md xl:py-8 justify-between items-center bg-[#00936c]"
            style={{ backgroundImage: `url(${bgLogo})` }}
          >
            <div>
              <h1 className="text-md md:text-xl font-normal">
                All packages list
              </h1>
              <p className="text-xs">
                To check and add your packages that you enroll in your profile.
              </p>
            </div>
            <div
              className="flex gap-0.5 items-center bg-[#E6F4F0] h-10 px-6 rounded-md cursor-pointer"
              onClick={handleClick}
            >
              <img src={logo} alt="" className="text-white" />
              <button className="text-sm text-[#00936c] flex items-center justify-center">
                Add New Package
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row flex-1">
            <div className="order-1 lg:order-1 lg:w-[20%] mb-4 lg:mb-0 lg:mr-4">
              <Sidebar onFilterChange={setSelectedPackageType} />
            </div>
            <div className="order-2 lg:order-2 flex-1 lg:px-6">
              {error ? (
                ""
              ) : (
                <StatusBar
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                />
              )}
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    marginTop: "-170px",
                  }}
                >
                  <Loader
                    type="spinner-cub"
                    bgColor="#00936c"
                    color="#00936c"
                    size={30}
                  />
                </div>
              ) : error ? (
                <Error errorLogo={errorLogo} error={error} />
              ) : selectedPackageType === "Transport" ? (
                filteredTransportPackages &&
                filteredTransportPackages.length > 0 ? (
                  <div>
                    {filteredTransportPackages.map((transportPackage) => (
                      <Card
                        key={transportPackage.transport_token}
                        imageUrl={`http://13.213.42.27${transportPackage.vehicle_photos}`}
                        title={transportPackage.name_and_model}
                        type={transportPackage.transport_type}
                        capacity={transportPackage.sitting_capacity}
                        availability={transportPackage.availability}
                        route1={transportPackage.common_1}
                        route2={transportPackage.common_2}
                        price={transportPackage.cost}
                        plateNo={transportPackage.plate_no}
                        packageType={transportPackage.package_type}
                        transportPackage={transportPackage} // Pass the whole package
                        onDeactivate={handleDeactivate}
                        setSelectedStatus={setSelectedStatus} // Pass the prop down
                      />
                    ))}
                    <Pagination
                      totalItems={transportPackages.length}
                      itemsPerPage={transportPackagesPerPage}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                ) : (
                  <Error
                    errorLogo={errorLogo}
                    error="No transport packages available."
                  />
                )
              ) : filteredPackages && filteredPackages.length > 0 ? (
                <PackageList
                  packages={filteredPackages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  packagesPerPage={packagesPerPage}
                />
              ) : (
                <Error
                  errorLogo={errorLogo}
                  error={`No ${selectedPackageType} packages available for ${selectedStatus} status.`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PackageManagement;
