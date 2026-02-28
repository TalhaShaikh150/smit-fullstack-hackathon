import { createBrowserRouter } from "react-router-dom";

// Layout
import Layout from "@/components/layout/Layout";

// Route Guards
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import PublicRoute from "@/components/shared/PublicRoute";

// Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import DoctorsPage from "@/pages/DoctorsPage";
import LoginPage from "@/pages/auth/LoginPage";
import AdminLoginPage from "@/pages/auth/AdminLoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";

// Role-based dashboards
import PatientDashboard from "@/pages/patient/PatientDashboard";
import BookAppointment from "@/pages/patient/BookAppointment";
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import ReceptionistDashboard from "@/pages/receptionist/ReceptionistDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageStaffPage from "@/pages/admin/ManageStaffPage";
import CheckInPage from "@/pages/receptionist/CheckInPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // ── Public Pages (anyone can see) ──
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "doctors",
        element: <DoctorsPage />,
      },

      // ── Auth Pages (only non-logged-in users) ──
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "admin/login",
        element: (
          <PublicRoute>
            <AdminLoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },

      // ── Protected Pages (only logged-in users) ──
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },

      // ── Role-based Dashboards ──
      {
        path: "patient/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "book-appointment",
        element: (
          <ProtectedRoute allowedRoles={["patient"]}>
            <BookAppointment />
          </ProtectedRoute>
        ),
      },
      {
        path: "doctor/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "receptionist/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <ReceptionistDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/manage-staff",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageStaffPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "receptionist/check-in",
        element: (
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <CheckInPage />
          </ProtectedRoute>
        ),
      },

      // ── 404 ──
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
