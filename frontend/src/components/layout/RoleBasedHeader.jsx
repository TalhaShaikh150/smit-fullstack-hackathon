import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, logout } from "../../features/auth/authSlice";

export const RoleBasedHeader = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) return null;

  const getNavLinks = () => {
    switch (user.role) {
      case "patient":
        return [
          { label: "Dashboard", href: "/patient/dashboard" },
          { label: "Book Appointment", href: "/patient/book-appointment" },
          { label: "My Appointments", href: "/patient/appointments" },
          { label: "My Prescriptions", href: "/patient/prescriptions" },
        ];
      case "doctor":
        return [
          { label: "Dashboard", href: "/doctor/dashboard" },
          { label: "Appointments", href: "/doctor/appointments" },
          { label: "Diagnoses", href: "/doctor/diagnoses" },
          { label: "Prescriptions", href: "/doctor/prescriptions" },
        ];
      case "receptionist":
        return [
          { label: "Dashboard", href: "/receptionist/dashboard" },
          { label: "Check-ins", href: "/receptionist/checkins" },
          { label: "Schedule", href: "/receptionist/schedule" },
        ];
      case "admin":
        return [
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Doctors", href: "/admin/doctors" },
          { label: "Receptionists", href: "/admin/receptionists" },
          { label: "Patients", href: "/admin/patients" },
          { label: "Analytics", href: "/admin/analytics" },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo & Brand */}
          <Link to="/" className="text-2xl font-bold">
            AI Clinic Manager
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="hover:bg-blue-700 px-3 py-2 rounded transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm">{user.name}</p>
              <p className="text-xs uppercase text-blue-200">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
              {user.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <span className="text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RoleBasedHeader;
