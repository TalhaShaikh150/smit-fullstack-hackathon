import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/shared/ProtectedRoute";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Patient Pages
import PatientDashboard from "../pages/patient/PatientDashboard";
import BookAppointment from "../pages/patient/BookAppointment";

// Doctor Pages
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import AddDiagnosis from "../pages/doctor/AddDiagnosis";
import CreatePrescription from "../pages/doctor/CreatePrescription";

// Receptionist Pages
import ReceptionistDashboard from "../pages/receptionist/ReceptionistDashboard";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";

// Other Pages
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";

export const RoleRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Patient Routes */}
      <Route
        path="/patient/*"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <Routes>
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="book-appointment" element={<BookAppointment />} />
              <Route path="*" element={<Navigate to="/patient/dashboard" />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Doctor Routes */}
      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <Routes>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route
                path="diagnosis/:appointmentId"
                element={<AddDiagnosis />}
              />
              <Route
                path="prescription/:appointmentId/:patientId"
                element={<CreatePrescription />}
              />
              <Route path="*" element={<Navigate to="/doctor/dashboard" />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Receptionist Routes */}
      <Route
        path="/receptionist/*"
        element={
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <Routes>
              <Route path="dashboard" element={<ReceptionistDashboard />} />
              <Route
                path="*"
                element={<Navigate to="/receptionist/dashboard" />}
              />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default RoleRouter;
