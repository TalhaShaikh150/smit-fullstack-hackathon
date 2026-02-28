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
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";

// Role-based dashboards
import PatientDashboard from "@/pages/patient/PatientDashboard";
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import ReceptionistDashboard from "@/pages/receptionist/ReceptionistDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";

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

      // ── 404 ──
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
