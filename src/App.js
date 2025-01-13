import React, { createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./customToast.css";

// Importing Super Admin pages
import LoginPage from "./pages/login/login";
import SuperAdminDashboard from "./pages/dashboard/dashboard"; // Super Admin Dashboard
import AccessProfilePage from "./pages/dashboard/dashboard-pages/AccessProfilePage";
import PendingProfilePage from "./pages/dashboard/dashboard-pages/PendingProfilePages/PendingProfilesList";
import ApproveAmountsPage from "./pages/dashboard/dashboard-pages/ApproveAmountsPages/ApproveAmountsPage";
import ProfileApprovalPage from "./pages/dashboard/dashboard-pages/PendingProfilePages/ProfileApprovalDetailPage";
import BookingDetailsPage from "./pages/dashboard/dashboard-pages/ApproveAmountsPages/BookingDetailsPage/BookingDetailsPage";
import ApprovePartnerAmountsPage from "./pages/dashboard/dashboard-pages/ApproveAmountsPartners/ApprovePartnerAmountsPage";
import PartnerBookingDetailsPage from "./pages/dashboard/dashboard-pages/ApproveAmountsPartners/BookingDetailsPage/BookingDetailsPage";

// Importing Partner Panel pages
import Dashboard from "./pages/Admin-Panel/Dashboard/Dashboard";
import PackageType from "./pages/Admin-Panel/PackageManagement/PackageType/PackageType";
import CreatePackagePage from "./pages/Admin-Panel/PackageManagement/CreateCompanyPackageForms/CreatePackagePage";
import PackageDetails from "./pages/Admin-Panel/PackageManagement/PackageDetailedPage/PackageDetailedPage";
import EditPackagePage from "./pages/Admin-Panel/PackageManagement/EditCompanyPackageForms/EditPackagePage";
import ContinueCreatedCompanyForms from "./pages/Admin-Panel/PackageManagement/ContinueCreatedCompanyForms/ContinueCreatedCompanyForms";
import PackageManagement from "./pages/Admin-Panel/PackageManagement/PackagesList/PackageManagement";
import IndTransportForm from "./pages/Admin-Panel/PackageManagement/CreateIndividualPackageForm/TransportForm";
import Profile from "./pages/Admin-Panel/ProfilePage/Profile";
import Bookings from "./pages/Admin-Panel/Bookings/Bookings";
import BookingDetails from "./pages/Admin-Panel/Bookings/BookingDetailsPage/BookingDetails";
import Wallet from "./pages/Admin-Panel/Wallet/wallet";
import AllPayments from "./pages/Admin-Panel/Wallet/components/ReceivablePayments/AllPayments";
import Reviews from "./pages/Admin-Panel/ReviewsRatings/Reviews";
import AirlineTickets from "./pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/AirlineTickets/AirlineTickets";
import TransportArrangement from "./pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/TransportArrangement/TransportArrangement";
import HotelArrangement from "./pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/HotelArrangement/HotelArrangement";
import UploadEvisa from "./pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/UploadVisa/UploadEvisa";
import WithdrawHistory from "./pages/Admin-Panel/Wallet/components/WithdrawHistory";
import AccountStatementHistory from "./pages/Admin-Panel/Wallet/components/AccountStatementHistory";
import Complaints from "./pages/Admin-Panel/Complaints/Complaints";
import FQA from "./pages/Admin-Panel/ExtraPages/FrequentlyAskedQuestions/FQA";
import PrivacyPolicy from "./pages/Admin-Panel/ExtraPages/PrivacyPolicy/PrivacyPolicy";
import TermsServices from "./pages/Admin-Panel/ExtraPages/TermsServices/TermsServices";
import Documentation from "./pages/Admin-Panel/ExtraPages/Documentation-Page/doc";
import ScrollToTopButton from "./components/ScrollToTopButton";
import "./components/ScrollToTopButton.css";
import { UserProvider } from "./context/UserContext";
import { BookingProvider } from "./context/BookingContext";
import { CurrencyProvider } from "./utility/CurrencyContext";
import DetailPage from "./pages/dashboard/dashboard-pages/ApproveAmountsPages/BookingDetailsPage/PackageDetailPage";
import HeaderNavbarCom from "./components/HeaderNavbarComponent";

// Utility function to get user status from local storage
const getUserStatus = () => {
  const profile = localStorage.getItem("SignedUp-User-Profile");
  if (!profile) return { isLoggedIn: false };
  try {
    const {
      is_email_verified,
      partner_type,
      account_status,
      partner_type_and_detail,
    } = JSON.parse(profile);

    return {
      isLoggedIn: true,
      isEmailVerified: is_email_verified,
      partnerType: partner_type,
      accountStatus: account_status,
      typeAndDetail: partner_type_and_detail,
    };
  } catch (e) {
    console.error("Error parsing profile JSON:", e);
    return { isLoggedIn: false };
  }
};

// Function to check if the super admin is logged in
const isSuperAdminLoggedIn = () => {
  return !!localStorage.getItem("isSuperAdmin");
};

// Super Admin Protected Route
const SuperAdminProtectedRoute = ({ element }) => {
  const isSuperAdmin = isSuperAdminLoggedIn();
  if (isSuperAdmin) {
    return element;
  }
  return <Navigate to="/" replace />;
};

// Partner Panel Protected Route
const PartnerPanelProtectedRoute = ({ element }) => {
  const { isLoggedIn, isEmailVerified, partnerType, accountStatus } =
    getUserStatus();
  const isSuperAdmin = isSuperAdminLoggedIn();

  if (isSuperAdmin) {
    return element; // Super Admin can bypass normal login checks
  }

  if (
    isLoggedIn &&
    isEmailVerified &&
    partnerType !== "NA" &&
    accountStatus === "Active"
  ) {
    return element;
  }

  return <Navigate to="/" replace />;
};

// Login Redirect Route
const LoginRedirectRoute = ({ element }) => {
  return isSuperAdminLoggedIn() ? (
    <Navigate to="/super-admin-dashboard" replace />
  ) : (
    element
  );
};

export const NavigationContext = createContext();

const App = () => {
  const [isEmailSignupVisited, setIsEmailSignupVisited] = useState(false);

  return (
    <div className="App">
      {/* ToastContainer should be placed here */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />

      <UserProvider>
        <CurrencyProvider>
          <BookingProvider>
            <NavigationContext.Provider
              value={{ isEmailSignupVisited, setIsEmailSignupVisited }}
            >
              <Router>
                <Routes>
                  {/* Super Admin Routes */}
                  <Route
                    path="/"
                    element={
                      <LoginRedirectRoute
                        element={
                          <HeaderNavbarCom>
                            <LoginPage />
                          </HeaderNavbarCom>
                        }
                      />
                    }
                  />
                  <Route
                    path="/super-admin-dashboard"
                    element={
                      <SuperAdminProtectedRoute
                        element={
                          <HeaderNavbarCom
                            title="Dashboard"
                            subtitle="Welcome to the dashboard. Manage your content here."
                          >
                            <SuperAdminDashboard />
                          </HeaderNavbarCom>
                        }
                      />
                    }
                  />
                  <Route
                    path="/access-profile"
                    element={
                      <SuperAdminProtectedRoute
                        element={
                          <HeaderNavbarCom
                            title="Access Profile"
                            subtitle="Manage and access user profiles here."
                          >
                            <AccessProfilePage />
                          </HeaderNavbarCom>
                        }
                      />
                    }
                  />
                  <Route
                    path="/pending-profiles"
                    element={
                      <SuperAdminProtectedRoute
                        element={
                          <HeaderNavbarCom
                            title="Pending Profiles"
                            subtitle="Review and approve pending profiles."
                          >
                            <PendingProfilePage />
                          </HeaderNavbarCom>
                        }
                      />
                    }
                  />
                  <Route
                    path="/approve-amounts"
                    element={
                      <SuperAdminProtectedRoute
                        element={
                          <HeaderNavbarCom
                            title="Approve Pending Amounts"
                            subtitle="Approve or reject booking amounts."
                          >
                            <ApproveAmountsPage />
                          </HeaderNavbarCom>
                        }
                      />
                    }
                  />
                  <Route
                    path="/profile-approval"
                    element={
                      <SuperAdminProtectedRoute
                        element={
                          <HeaderNavbarCom
                            title="Profile Approval"
                            subtitle="Review and approve profile details."
                          >
                            <ProfileApprovalPage />
                          </HeaderNavbarCom>
                        }
                      />
                    }
                  />
                  <Route
                    path="/booking-details"
                    element={
                      <SuperAdminProtectedRoute
                        element={
                          <HeaderNavbarCom
                            title="Booking Details"
                            subtitle="View and manage booking details."
                          >
                            <BookingDetailsPage />
                          </HeaderNavbarCom>
                        }
                      />
                    }
                  />
                  <Route
                    path="/approve-partners-amounts"
                    element={
                      <SuperAdminProtectedRoute
                        element={
                          <HeaderNavbarCom
                            title="Approve Pending Amounts of Partners"
                            subtitle="Approve or reject partner amounts."
                          >
                            <ApprovePartnerAmountsPage />
                          </HeaderNavbarCom>
                        }
                      />
                    }
                  />
                  <Route
                    path="/booking-details-for-partners"
                    element={
                      <SuperAdminProtectedRoute
                        element={
                          <HeaderNavbarCom
                            title="Booking Details"
                            subtitle="View and manage booking details."
                          >
                            <PartnerBookingDetailsPage />
                          </HeaderNavbarCom>
                        }
                      />
                    }
                  />

                  {/* Partner Panel Routes */}
                  <Route
                    path="/partner-dashboard"
                    element={
                      <PartnerPanelProtectedRoute element={<Dashboard />} />
                    }
                  />
                  <Route
                    path="/package-type"
                    element={
                      <PartnerPanelProtectedRoute element={<PackageType />} />
                    }
                  />
                  <Route
                    path="/company/package-creation"
                    element={
                      <PartnerPanelProtectedRoute
                        element={<CreatePackagePage />}
                      />
                    }
                  />
                  <Route
                    path="/packagedetails"
                    element={
                      <PartnerPanelProtectedRoute
                        element={<PackageDetails />}
                      />
                    }
                  />
                  <Route
                    path="/packages"
                    element={
                      <PartnerPanelProtectedRoute
                        element={<PackageManagement />}
                      />
                    }
                  />
                  <Route
                    path="/individual/package-creation"
                    element={
                      <PartnerPanelProtectedRoute
                        element={<IndTransportForm />}
                      />
                    }
                  />
                  <Route
                    path="/edit-package"
                    element={
                      <PartnerPanelProtectedRoute
                        element={<EditPackagePage isEditing />}
                      />
                    }
                  />
                  <Route
                    path="/company/continue-existing-package-creation"
                    element={
                      <PartnerPanelProtectedRoute
                        element={<ContinueCreatedCompanyForms />}
                      />
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PartnerPanelProtectedRoute element={<Profile />} />
                    }
                  />
                  <Route
                    path="/booking"
                    element={
                      <PartnerPanelProtectedRoute element={<Bookings />} />
                    }
                  />
                  <Route
                    path="/bookingdetails"
                    element={
                      <PartnerPanelProtectedRoute
                        element={<BookingDetails />}
                      />
                    }
                  />
                  <Route
                    path="/wallet"
                    element={
                      <PartnerPanelProtectedRoute element={<Wallet />} />
                    }
                  />
                  <Route
                    path="/all-payments"
                    element={
                      <PartnerPanelProtectedRoute element={<AllPayments />} />
                    }
                  />
                  <Route
                    path="/package/upload-evisa"
                    element={
                      <PartnerPanelProtectedRoute element={<UploadEvisa />} />
                    }
                  />
                  <Route
                    path="/package/airline-tickets"
                    element={
                      <PartnerPanelProtectedRoute
                        element={<AirlineTickets />}
                      />
                    }
                  />
                  <Route
                    path="/package/transport-arrangement"
                    element={
                      <PartnerPanelProtectedRoute
                        element={<TransportArrangement />}
                      />
                    }
                  />
                  <Route
                    path="/package/hotel-arrangement"
                    element={
                      <PartnerPanelProtectedRoute
                        element={<HotelArrangement />}
                      />
                    }
                  />
                  <Route
                    path="/reviews-ratings"
                    element={
                      <PartnerPanelProtectedRoute element={<Reviews />} />
                    }
                  />
                  <Route
                    path="/withdrawhistory"
                    element={
                      <PartnerPanelProtectedRoute
                        element={<WithdrawHistory />}
                      />
                    }
                  />
                  <Route
                    path="/accountstatementhistory"
                    element={
                      <PartnerPanelProtectedRoute
                        element={<AccountStatementHistory />}
                      />
                    }
                  />
                  <Route
                    path="/faq"
                    element={<PartnerPanelProtectedRoute element={<FQA />} />}
                  />
                  <Route
                    path="/privacy-policy"
                    element={
                      <PartnerPanelProtectedRoute element={<PrivacyPolicy />} />
                    }
                  />
                  <Route
                    path="/terms-of-services"
                    element={
                      <PartnerPanelProtectedRoute element={<TermsServices />} />
                    }
                  />
                  <Route
                    path="/documentation"
                    element={
                      <PartnerPanelProtectedRoute element={<Documentation />} />
                    }
                  />
                  <Route
                    path="/complaints"
                    element={
                      <PartnerPanelProtectedRoute element={<Complaints />} />
                    }
                  />
                  <Route path="/detailpage" element={<DetailPage />} />
                </Routes>
                <ScrollToTopButton />
                <ToastContainer
                  position="top-right"
                  hideProgressBar={true}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </Router>
            </NavigationContext.Provider>
          </BookingProvider>
        </CurrencyProvider>
      </UserProvider>
    </div>
  );
};

export default App;
