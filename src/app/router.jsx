import { createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";

// Admin Dashboard Imports
import Login from "../views/Login.jsx";
import DashboardLayout from "../views/DashboardLayout.jsx";
import AuthWrapper from "../components/AuthWrapper.jsx";
import OwnersList from "../views/OwnersList.jsx";
import PropertiesList from "../views/PropertiesList.jsx";
import AllPropertiesList from "../views/AllPropertiesList.jsx";
import PendingApprovals from "../views/PendingApprovals.jsx";
import MasterDataConfig from "../views/MasterDataConfig.jsx";
import AdminConfig from "../views/AdminConfig.jsx";
import GlobalAdminDashboard from "../views/GlobalAdminDashboard.jsx";
import BlogManager from "../features/blogs/BlogManager.jsx";

import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";

import ProtectedRoute from "../features/auth/components/ProtectedRoute.jsx";

import OwnerLayout from "../layouts/OwnerLayout/OwnerLayout.jsx";
import OwnerDashboardPage from "../features/owner-dashboard/pages/OwnerDashboardPage.jsx";

import MyPropertiesPage from "../features/properties/pages/MyPropertiesPage.jsx";
import AddPropertyPage from "../features/properties/pages/AddPropertyPage.jsx";
import ManagePropertyPage from "../features/properties/pages/ManagePropertyPage.jsx";

import RoomsPage from "../features/rooms/pages/RoomsPage.jsx";
import AddRoomPage from "../features/rooms/pages/AddRoomPage.jsx";
import EditRoomPage from "../features/rooms/pages/EditRoomPage.jsx";
import EmployeesPage from "../features/employees/pages/EmployeesPage.jsx";
import BookingsPage from "../features/owner/pages/BookingsPage.jsx";
import EnquiriesPage from "../features/owner/pages/EnquiriesPage.jsx";
import AvailabilityPage from "../features/owner/pages/AvailabilityPage.jsx";
import InventoryCalendarPage from "../features/inventory/pages/InventoryCalendarPage.jsx";
import InventorySetupPage from "../features/inventory/pages/InventorySetupPage.jsx";
import RoomBlocksPage from "../features/inventory/pages/RoomBlocksPage.jsx";
import StopSellPage from "../features/inventory/pages/StopSellPage.jsx";
import InventoryHistoryPage from "../features/inventory/pages/InventoryHistoryPage.jsx";
import PricingPage from "../features/owner/pages/PricingPage.jsx";
import ReviewsPage from "../features/owner/pages/ReviewsPage.jsx";
import PaymentsPage from "../features/owner/pages/PaymentsPage.jsx";
import ReportsPage from "../features/owner/pages/ReportsPage.jsx";
import SettingsPage from "../features/owner/pages/SettingsPage.jsx";
import ProfilePage from "../features/owner/pages/ProfilePage.jsx";

// Activity Provider Imports
import { ACTIVITY_PROVIDER_ROUTES } from "../constants/routes.js";
import ActivityLoginPage from "../features/activities/pages/ActivityLoginPage.jsx";
import ActivityRegisterPage from "../features/activities/pages/ActivityRegisterPage.jsx";
import ActivityVerifyOtpPage from "../features/activities/pages/ActivityVerifyOtpPage.jsx";
import ActivityForgotPasswordPage from "../features/activities/pages/ActivityForgotPasswordPage.jsx";
import ActivityVerificationStatusPage from "../features/activities/pages/ActivityVerificationStatusPage.jsx";

import ActivityProtectedRoute from "../features/activities/components/ActivityProtectedRoute.jsx";
import ActivityProviderLayout from "../layouts/ActivityProviderLayout/ActivityProviderLayout.jsx";
import ActivityDashboardPage from "../features/activities/pages/ActivityDashboardPage.jsx";
import MyActivitiesPage from "../features/activities/pages/MyActivitiesPage.jsx";
import AddActivityPage from "../features/activities/pages/AddActivityPage.jsx";
import EditActivityPage from "../features/activities/pages/EditActivityPage.jsx";
import ActivitySlotsPage from "../features/activities/pages/ActivitySlotsPage.jsx";
import ActivityRatesPage from "../features/activities/pages/ActivityRatesPage.jsx";
import ActivityMediaPage from "../features/activities/pages/ActivityMediaPage.jsx";
import ActivityBookingsPage from "../features/activities/pages/ActivityBookingsPage.jsx";
import ActivityParticipantsPage from "../features/activities/pages/ActivityParticipantsPage.jsx";
import ActivityProfilePage from "../features/activities/pages/ActivityProfilePage.jsx";
import ActivitySettingsPage from "../features/activities/pages/ActivitySettingsPage.jsx";

import { ROUTES } from "../constants/routes.js";

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <App />,
  },

  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },

  {
    path: "/employee/login",
    element: <LoginPage />,
  },

  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <OwnerLayout />,
        children: [
          {
            path: ROUTES.OWNER_DASHBOARD,
            element: <OwnerDashboardPage />,
          },

          {
            path: ROUTES.OWNER_PROPERTIES,
            element: <MyPropertiesPage />,
          },

          {
            path: ROUTES.OWNER_ADD_PROPERTY,
            element: <AddPropertyPage />,
          },

          {
            path: "/owner/properties/:propertyId",
            element: <ManagePropertyPage />,
          },

          {
            path: ROUTES.OWNER_ROOMS,
            element: <RoomsPage />,
          },

          {
            path: "/owner/rooms/add",
            element: <AddRoomPage />,
          },

          {
            path: "/owner/rooms/:roomId/edit",
            element: <EditRoomPage />,
          },

          {
            path: ROUTES.OWNER_EMPLOYEES,
            element: <EmployeesPage />,
          },

          {
            path: ROUTES.OWNER_BOOKINGS,
            element: <BookingsPage />,
          },

          {
            path: ROUTES.OWNER_ENQUIRIES,
            element: <EnquiriesPage />,
          },

          {
            path: ROUTES.OWNER_AVAILABILITY,
            element: <InventoryCalendarPage />,
          },

          {
            path: ROUTES.OWNER_INVENTORY,
            element: <InventoryCalendarPage />,
          },

          {
            path: ROUTES.OWNER_INVENTORY_SETUP,
            element: <InventorySetupPage />,
          },

          {
            path: ROUTES.OWNER_INVENTORY_BLOCKS,
            element: <RoomBlocksPage />,
          },

          {
            path: ROUTES.OWNER_INVENTORY_STOP_SELL,
            element: <StopSellPage />,
          },

          {
            path: ROUTES.OWNER_INVENTORY_HISTORY,
            element: <InventoryHistoryPage />,
          },

          {
            path: ROUTES.OWNER_PRICING,
            element: <PricingPage />,
          },

          {
            path: ROUTES.OWNER_REVIEWS,
            element: <ReviewsPage />,
          },

          {
            path: ROUTES.OWNER_PAYMENTS,
            element: <PaymentsPage />,
          },

          {
            path: ROUTES.OWNER_REPORTS,
            element: <ReportsPage />,
          },

          {
            path: ROUTES.OWNER_SETTINGS,
            element: <SettingsPage />,
          },

          {
            path: ROUTES.OWNER_PROFILE,
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
  // Admin Ecosystem
  {
    path: "/admin",
    element: <AuthWrapper />,
    children: [
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <GlobalAdminDashboard /> },
          { path: "owners", element: <OwnersList /> },
          { path: "owners/:ownerId/properties", element: <PropertiesList /> },
          { path: "properties", element: <AllPropertiesList /> },
          { path: "pending", element: <PendingApprovals /> },
          { path: "master-data", element: <MasterDataConfig /> },
          { path: "settings", element: <AdminConfig /> },
          { path: "blogs", element: <BlogManager /> }
        ]
      }
    ]
  },
  {
    path: "/admin/login",
    element: <Login />
  },

  // Activity Provider Public Auth Routes
  {
    path: ACTIVITY_PROVIDER_ROUTES.LOGIN,
    element: <ActivityLoginPage />,
  },
  {
    path: ACTIVITY_PROVIDER_ROUTES.REGISTER,
    element: <ActivityRegisterPage />,
  },
  {
    path: ACTIVITY_PROVIDER_ROUTES.VERIFY_OTP,
    element: <ActivityVerifyOtpPage />,
  },
  {
    path: ACTIVITY_PROVIDER_ROUTES.FORGOT_PASSWORD,
    element: <ActivityForgotPasswordPage />,
  },

  // Activity Provider Protected Ecosystem
  {
    element: <ActivityProtectedRoute />,
    children: [
      {
        element: <ActivityProviderLayout />,
        children: [
          {
            path: ACTIVITY_PROVIDER_ROUTES.DASHBOARD,
            element: <ActivityDashboardPage />,
          },
          {
            path: ACTIVITY_PROVIDER_ROUTES.ACTIVITIES,
            element: <MyActivitiesPage />,
          },
          {
            path: ACTIVITY_PROVIDER_ROUTES.ADD_ACTIVITY,
            element: <AddActivityPage />,
          },
          {
            path: "/activity-provider/activities/:activityId/edit",
            element: <EditActivityPage />,
          },
          {
            path: ACTIVITY_PROVIDER_ROUTES.AVAILABILITY,
            element: <ActivitySlotsPage />,
          },
          {
            path: ACTIVITY_PROVIDER_ROUTES.PRICING,
            element: <ActivityRatesPage />,
          },
          {
            path: ACTIVITY_PROVIDER_ROUTES.MEDIA,
            element: <ActivityMediaPage />,
          },
          {
            path: ACTIVITY_PROVIDER_ROUTES.BOOKINGS,
            element: <ActivityBookingsPage />,
          },
          {
            path: ACTIVITY_PROVIDER_ROUTES.PARTICIPANTS,
            element: <ActivityParticipantsPage />,
          },
          {
            path: ACTIVITY_PROVIDER_ROUTES.PROFILE,
            element: <ActivityProfilePage />,
          },
          {
            path: ACTIVITY_PROVIDER_ROUTES.SETTINGS,
            element: <ActivitySettingsPage />,
          },
          {
            path: ACTIVITY_PROVIDER_ROUTES.VERIFICATION_STATUS,
            element: <ActivityVerificationStatusPage />,
          },
        ],
      },
    ],
  }
]);

export default router;