import React, { Suspense, createContext, lazy, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./customToast.css";
import "./components/ScrollToTopButton.css";
import ScrollToTopButton from "./components/ScrollToTopButton";
import HeaderNavbarCom from "./components/HeaderNavbarComponent";
import { RouteLoader } from "./components/ui";
import { UserProvider } from "./context/UserContext";
import { BookingProvider } from "./context/BookingContext";
import { CurrencyProvider } from "./utility/CurrencyContext";

const LoginPage = lazy(() => import("./pages/login/login"));

const SuperAdminDashboard = lazy(() => import("./pages/dashboard/dashboard"));
const AccessProfilePage = lazy(() => import("./pages/dashboard/dashboard-pages/AccessProfilePage"));
const PendingProfilePage = lazy(() => import("./pages/dashboard/dashboard-pages/PendingProfilePages/PendingProfilesList"));
const ApproveAmountsPage = lazy(() => import("./pages/dashboard/dashboard-pages/ApproveAmountsPages/ApproveAmountsPage"));
const ProfileApprovalPage = lazy(() => import("./pages/dashboard/dashboard-pages/PendingProfilePages/ProfileApprovalDetailPage"));
const BookingDetailsPage = lazy(() => import("./pages/dashboard/dashboard-pages/ApproveAmountsPages/BookingDetailsPage/BookingDetailsPage"));
const ApprovePartnerAmountsPage = lazy(() => import("./pages/dashboard/dashboard-pages/ApproveAmountsPartners/ApprovePartnerAmountsPage"));
const PartnerBookingDetailsPage = lazy(() => import("./pages/dashboard/dashboard-pages/ApproveAmountsPartners/BookingDetailsPage/BookingDetailsPage"));
const DetailPage = lazy(() => import("./pages/dashboard/dashboard-pages/ApproveAmountsPages/BookingDetailsPage/PackageDetailPage"));

const Dashboard = lazy(() => import("./pages/Admin-Panel/Dashboard/Dashboard"));
const PackageType = lazy(() => import("./pages/Admin-Panel/PackageManagement/PackageType/PackageType"));
const CreatePackagePage = lazy(() => import("./pages/Admin-Panel/PackageManagement/CreateCompanyPackageForms/CreatePackagePage"));
const PackageDetails = lazy(() => import("./pages/Admin-Panel/PackageManagement/PackageDetailedPage/PackageDetailedPage"));
const EditPackagePage = lazy(() => import("./pages/Admin-Panel/PackageManagement/EditCompanyPackageForms/EditPackagePage"));
const ContinueCreatedCompanyForms = lazy(() => import("./pages/Admin-Panel/PackageManagement/ContinueCreatedCompanyForms/ContinueCreatedCompanyForms"));
const PackageManagement = lazy(() => import("./pages/Admin-Panel/PackageManagement/PackagesList/PackageManagement"));
const IndTransportForm = lazy(() => import("./pages/Admin-Panel/PackageManagement/CreateIndividualPackageForm/TransportForm"));
const Profile = lazy(() => import("./pages/Admin-Panel/ProfilePage/Profile"));
const Bookings = lazy(() => import("./pages/Admin-Panel/Bookings/Bookings"));
const BookingDetails = lazy(() => import("./pages/Admin-Panel/Bookings/BookingDetailsPage/BookingDetails"));
const Wallet = lazy(() => import("./pages/Admin-Panel/Wallet/wallet"));
const AllPayments = lazy(() => import("./pages/Admin-Panel/Wallet/components/ReceivablePayments/AllPayments"));
const Reviews = lazy(() => import("./pages/Admin-Panel/ReviewsRatings/Reviews"));
const AirlineTickets = lazy(() => import("./pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/AirlineTickets/AirlineTickets"));
const TransportArrangement = lazy(() => import("./pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/TransportArrangement/TransportArrangement"));
const HotelArrangement = lazy(() => import("./pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/HotelArrangement/HotelArrangement"));
const UploadEvisa = lazy(() => import("./pages/Admin-Panel/Bookings/BookingDetailsPage/ActiveSatusComponents/UploadVisa/UploadEvisa"));
const WithdrawHistory = lazy(() => import("./pages/Admin-Panel/Wallet/components/WithdrawHistory"));
const AccountStatementHistory = lazy(() => import("./pages/Admin-Panel/Wallet/components/AccountStatementHistory"));
const Complaints = lazy(() => import("./pages/Admin-Panel/Complaints/Complaints"));
const FQA = lazy(() => import("./pages/Admin-Panel/ExtraPages/FrequentlyAskedQuestions/FQA"));
const PrivacyPolicy = lazy(() => import("./pages/Admin-Panel/ExtraPages/PrivacyPolicy/PrivacyPolicy"));
const TermsServices = lazy(() => import("./pages/Admin-Panel/ExtraPages/TermsServices/TermsServices"));
const Documentation = lazy(() => import("./pages/Admin-Panel/ExtraPages/Documentation-Page/doc"));

const getUserStatus = () => {
  const profile = localStorage.getItem("SignedUp-User-Profile");
  if (!profile) return { isLoggedIn: false };

  try {
    const {
      is_email_verified: isEmailVerified,
      partner_type: partnerType,
      account_status: accountStatus,
      partner_type_and_detail: typeAndDetail,
    } = JSON.parse(profile);

    return {
      isLoggedIn: true,
      isEmailVerified,
      partnerType,
      accountStatus,
      typeAndDetail,
    };
  } catch (error) {
    console.error("Error parsing profile JSON:", error);
    return { isLoggedIn: false };
  }
};

const isSuperAdminLoggedIn = () => Boolean(localStorage.getItem("isSuperAdmin"));

const SuperAdminProtectedRoute = ({ element }) => {
  if (isSuperAdminLoggedIn()) {
    return element;
  }

  return <Navigate to="/" replace />;
};

const PartnerPanelProtectedRoute = ({ element }) => {
  const { isLoggedIn, isEmailVerified, partnerType, accountStatus } = getUserStatus();

  if (isSuperAdminLoggedIn()) {
    return element;
  }

  if (isLoggedIn && isEmailVerified && partnerType !== "NA" && accountStatus === "Active") {
    return element;
  }

  return <Navigate to="/" replace />;
};

const LoginRedirectRoute = ({ element }) => {
  return isSuperAdminLoggedIn() ? <Navigate to="/super-admin-dashboard" replace /> : element;
};

const SUPER_ADMIN_ROUTES = [
  {
    path: "/super-admin-dashboard",
    title: "Dashboard",
    subtitle: "Welcome to the dashboard. Manage your content here.",
    Component: SuperAdminDashboard,
  },
  {
    path: "/access-profile",
    title: "Access Profile",
    subtitle: "Manage and access user profiles here.",
    Component: AccessProfilePage,
  },
  {
    path: "/pending-profiles",
    title: "Pending Profiles",
    subtitle: "Review and approve pending profiles.",
    Component: PendingProfilePage,
  },
  {
    path: "/approve-amounts",
    title: "Approve Pending Amounts",
    subtitle: "Approve or reject booking amounts.",
    Component: ApproveAmountsPage,
  },
  {
    path: "/profile-approval",
    title: "Profile Approval",
    subtitle: "Review profile details and decide approval.",
    Component: ProfileApprovalPage,
  },
  {
    path: "/booking-details",
    title: "Booking Details",
    subtitle: "View and manage booking details.",
    Component: BookingDetailsPage,
  },
  {
    path: "/approve-partners-amounts",
    title: "Approve Pending Amounts of Partners",
    subtitle: "Approve or reject partner amounts.",
    Component: ApprovePartnerAmountsPage,
  },
  {
    path: "/booking-details-for-partners",
    title: "Booking Details",
    subtitle: "View and manage partner booking details.",
    Component: PartnerBookingDetailsPage,
  },
];

const PARTNER_ROUTES = [
  { path: "/partner-dashboard", Component: Dashboard },
  { path: "/dashboard", Component: Dashboard },
  { path: "/package-type", Component: PackageType },
  { path: "/company/package-creation", Component: CreatePackagePage },
  { path: "/packagedetails", Component: PackageDetails },
  { path: "/packages", Component: PackageManagement },
  { path: "/individual/package-creation", Component: IndTransportForm },
  { path: "/edit-package", Component: EditPackagePage, props: { isEditing: true } },
  { path: "/company/continue-existing-package-creation", Component: ContinueCreatedCompanyForms },
  { path: "/profile", Component: Profile },
  { path: "/booking", Component: Bookings },
  { path: "/bookingdetails", Component: BookingDetails },
  { path: "/wallet", Component: Wallet },
  { path: "/all-payments", Component: AllPayments },
  { path: "/package/upload-evisa", Component: UploadEvisa },
  { path: "/package/airline-tickets", Component: AirlineTickets },
  { path: "/package/transport-arrangement", Component: TransportArrangement },
  { path: "/package/hotel-arrangement", Component: HotelArrangement },
  { path: "/reviews-ratings", Component: Reviews },
  { path: "/withdrawhistory", Component: WithdrawHistory },
  { path: "/accountstatementhistory", Component: AccountStatementHistory },
  { path: "/faq", Component: FQA },
  { path: "/privacy-policy", Component: PrivacyPolicy },
  { path: "/terms-of-services", Component: TermsServices },
  { path: "/documentation", Component: Documentation },
  { path: "/complaints", Component: Complaints },
];

export const NavigationContext = createContext();

const App = () => {
  const [isEmailSignupVisited, setIsEmailSignupVisited] = useState(false);

  return (
    <div className="App admin-theme">
      <UserProvider>
        <CurrencyProvider>
          <BookingProvider>
            <NavigationContext.Provider value={{ isEmailSignupVisited, setIsEmailSignupVisited }}>
              <Router>
                <Suspense fallback={<RouteLoader />}>
                  <Routes>
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

                    {SUPER_ADMIN_ROUTES.map(({ path, title, subtitle, Component }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <SuperAdminProtectedRoute
                            element={
                              <HeaderNavbarCom title={title} subtitle={subtitle}>
                                <Component />
                              </HeaderNavbarCom>
                            }
                          />
                        }
                      />
                    ))}

                    {PARTNER_ROUTES.map(({ path, Component, props }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <PartnerPanelProtectedRoute
                            element={<Component {...(props || {})} />}
                          />
                        }
                      />
                    ))}

                    <Route path="/detailpage" element={<DetailPage />} />
                  </Routes>
                </Suspense>

                <ScrollToTopButton />
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar
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
